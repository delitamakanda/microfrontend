import { Card } from 'primereact/card';
import { Skeleton } from 'primereact/skeleton';

// eslint-disable-next-line react/prop-types -- prop-types is not a dependency of this app
export const KpiCard =({ title, color, total, trend, icon, loading = false, formatTotal = (value) => value }) => {
    const renderTrends = () => {
        const calc = Math.round((trend / total) * 100) || 0;
        if (total < trend) {
            return (
                <div className='text-green-500'>
                    <span className='font-medium mr-2'>+{calc}%</span>
                </div>
            )
        }
        return (
            <div className='text-pink-500'>
                <span className='font-medium mr-2'>-{calc}%</span>
            </div>
        )
    }
    return (
        <Card className={`shadow-l border-left-3 border-${color}`} title={
            <div className='flex justify-content-between'>
                <div>
                    <span className='block font-bold text-xl mb-3'>
                        {title}
                    </span>
                    <div className='text-900 font-medium text-2xl'>
                        {loading
                            ? <Skeleton width="6rem" height="2rem" role="status" aria-label={`Loading ${title}`} />
                            : formatTotal(total)}
                    </div>
                </div>
                <div className="flex align-items-center justify-content-center"
                    style={{ width: "2.5rem", height: "2.5rem" }}>
                    <i className={`pi ${icon} text-${color} text-2xl`} />
                </div>
            </div>
        }>
            <div className='flex'>
                {loading ? <Skeleton width="8rem" height="1rem" aria-hidden="true" /> : (
                    <>
                        {renderTrends()}
                        <span className='text-500'>since last week</span>
                    </>
                )}
            </div>
        </Card>
    )
}