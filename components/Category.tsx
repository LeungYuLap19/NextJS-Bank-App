import { topCategoryStyles } from '@/constants'
import Image from 'next/image';
import React from 'react'
import { Progress } from "@/components/ui/progress"

export default function Category({ category }: CategoryProps) {
    const { bg, circleBg, text, progress, icon } = 
        topCategoryStyles[category.name as keyof typeof topCategoryStyles] ||
        topCategoryStyles['default'];

    return (
        <div className={`gap-4 w-full flex p-4 rounded-xl ${bg}`}>
            <div className={`flex-center size-10 rounded-full shrink-0 ${circleBg}`}>
                <Image 
                    src={icon}
                    alt={category.name}
                    height={20} width={20}
                />
            </div>

            <div className='flex flex-col w-full h-9 justify-between'>
                <div className='flex justify-between'>
                    <p className={`${text.main} text-sm`}>{category.name}</p> 
                    <p className={`${text.count} text-sm`}>{category.count}</p>
                </div>

                <Progress 
                    value={category.count / category.totalCount * 100} 
                    className={`w-full h-2 ${progress.bg}`}
                    indicatorClassName={`w-full h-2 ${progress.indicator}`}
                />
            </div>
        </div>
    )
}
