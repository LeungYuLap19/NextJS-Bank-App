'use server'
import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const { 
    APPWRITE_DATABASE_ID, 
    APPWRITE_USER_COLLECTION_ID, 
    APPWRITE_BANK_COLLECTION_ID 
} = process.env;

async function getUserInfo({ userId }: getUserInfoProps) {
    try {
        const { database } = await createAdminClient();

        const user = await database.listDocuments(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_COLLECTION_ID!,
            [Query.equal('userid', [userId])]
        );

        return parseStringify(user.documents[0]);
    } catch (error) {
        console.error('Error', error);
    }
}

async function signIn({ email, password } : signInProps) {
    try {
        const { account } = await createAdminClient();

        const session = await account.createEmailPasswordSession(email, password);
        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        const user = await getUserInfo({ userId: session.userId });

        return parseStringify(user);
    } catch (error) {
        console.error('Error', error);
    }
}

async function signUp({ password, ...userData }: SignUpParams) {
    const { email, firstName, lastName } = userData;
    try {
        const { account, database } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(), email, password, `${firstName} ${lastName}`);
        if (!newUserAccount) throw new Error('Error creating user');

        const dwollaCustomerUrl = await createDwollaCustomer({ ...userData, type: 'personal' });
        if (!dwollaCustomerUrl) throw new Error('Error creating dwolla customer');

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        const newUser = await database.createDocument(
            APPWRITE_DATABASE_ID!,
            APPWRITE_USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userid: newUserAccount.$id,
                dwollaCustomerid: dwollaCustomerId,
                dwollaCustomerUrl
            }
        );

        const session = await account.createEmailPasswordSession(email, password);
        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUser);
    } catch (error) {
        console.error('Error', error);
    }
}

async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const result = await account.get();
      const user = await getUserInfo({ userId: result.$id });
      return parseStringify(user);
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}
  
async function logoutAccount() {
    try {
       const { account } = await createSessionClient();
       cookies().delete('appwrite-session');
       await account.deleteSession('current'); 
    } catch (error) {
        console.error('Error', error);
        return null;
    }
}

async function createLinkToken(user: User) {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ['auth'] as Products[],
            language: 'en',
            country_codes: ['US'] as CountryCode[],
        }

        const response = await plaidClient.linkTokenCreate(tokenParams);
        return parseStringify({ linkToken: response.data.link_token });
    } catch (error) {
        console.error('Error', error);
    }
}

async function createBankAccount({ userid, bankid, accountid, accessToken, fundingSourceUrl, shareableid }: createBankAccountProps) {
    try {
        const { database } = await createAdminClient();
        const bankAccount = await database.createDocument(
            // can use '!' to tell TS this variable will always be available so dont worry
            APPWRITE_DATABASE_ID!,
            APPWRITE_BANK_COLLECTION_ID!,
            ID.unique(),
            { userid, bankid, accountid, accessToken, fundingSourceUrl, shareableid }
        );

        return parseStringify(bankAccount);
    } catch (error) {
        console.error('Error', error);
    }
}

async function exchangePublicToken({ publicToken, user }: exchangePublicTokenProps) {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });
        const accessToken = response.data.access_token;
        const itemid = response.data.item_id;

        // Get account information from Plaid using access token
        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // Create a processor token for Dwolla by access token and account id
        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: 'dwolla' as ProcessorTokenCreateRequestProcessorEnum
        }
        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        // Create a funding source URL for the account using the Dwolla customer id, processor token and bank name
        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerid,
            processorToken,
            bankName: accountData.name 
        });
        if (!fundingSourceUrl) throw Error;

        // Create a bank account
        await createBankAccount({
            userid: user.$id,
            bankid: itemid,
            accountid: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableid: encryptId(accountData.account_id),
        });

        // Clear cache of path '/'
        revalidatePath('/');
        return parseStringify({ publicTokenExchange: 'complete' });
    } catch (error) {
        console.error('Error', error);
    }
}

async function getBanks({ userId }: getBanksProps) {
    try {
        const { database } = await createAdminClient();
        const banks = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal('userid', [userId])] 
        );
        return parseStringify(banks.documents);
    } catch (error) {
        console.error('Error', error);
    }
}

async function getBank({ documentId }: getBankProps) {
    try {
        const { database } = await createAdminClient();
        const bank = await database.getDocument(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_BANK_COLLECTION_ID!,
            documentId
        );
        return parseStringify(bank);
    } catch (error) {
        console.error('Error', error);
    }
}

async function getBankByAccountId({ accountId }: getBankByAccountIdProps) {
    try {
        const { database } = await createAdminClient();
        const bank = await database.listDocuments(
            APPWRITE_DATABASE_ID!, 
            APPWRITE_BANK_COLLECTION_ID!,
            [Query.equal('accountid', [accountId])]
        )
        if (bank.total !== 1) return null;
        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.error('Error', error);
    }
}

export {
    signIn,
    signUp,
    getLoggedInUser,
    logoutAccount,
    createLinkToken,
    exchangePublicToken,
    getBanks,
    getBank,
    getBankByAccountId
}