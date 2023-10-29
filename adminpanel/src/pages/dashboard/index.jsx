import { KpiCard, ChartView } from '../../components/dashboard'
import daysjs from 'dayjs'

const query = {
    start: daysjs().subtract(7, 'days').startOf('day'),
    end: daysjs().endOf('day')

}

export const Dashboard = () => {
    return (
        <div className='grid'>
            <div className='col-12 lg:col-6 xl:col-4'>
                <KpiCard title="Weekly Revenue" color="blue-300" total={300} trend={250} formatTotal={(value) => `$ ${value}`} icon="pi-dollar" />
            </div>
            <div className='col-12 lg:col-6 xl:col-4'>
                <KpiCard title="Weekly Orders" color="orange-300" total={25} trend={12} icon="pi-shopping-cart" />
            </div>
            <div className='col-12 lg:col-6 xl:col-4'>
                <KpiCard title="New Customers" color="green-300" total={1} trend={2} icon="pi-users" />
            </div>
            <div className='col-12'>
                <ChartView revenue={[]} orders={[]} customers={[]} />
            </div>
        </div>
    )
}
