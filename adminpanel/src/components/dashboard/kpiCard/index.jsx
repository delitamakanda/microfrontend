import { Card } from 'primereact/card';

export const KpiCard = ({ title, color, total, trend, icon, formatTotal = (value) => value }) => {
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
                        {formatTotal(total)}
                    </div>
                </div>
                <div className="flex align-items-center justify-content-center"
                    style={{ width: "2.5rem", height: "2.5rem" }}>
                    <i className={`pi ${icon} text-${color} text-2xl`} />
                </div>
            </div>
        }>
            <div className='flex'>
                {renderTrends()}
                <span className='text-500'>since last week</span>
            </div>
        </Card>
    )
}