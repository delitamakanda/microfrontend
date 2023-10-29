import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { TabView, TabPanel } from 'primereact/tabview';

const commonLineOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
        legend: {
            display: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
        }
    }
};

const formatDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
})

export const ChartView = ({ revenue, orders, customers }) => {
    const dailyRevenueLabels = revenue.map((item) => {
        return formatDate.format(new Date(item.date))
    })

    const dailyRevenueData = revenue.map((item) => +item.value);

    const dailyOrdersLabels = orders.map((item) => {
        return formatDate.format(new Date(item.date))
    })

    const dailyOrdersData = orders.map((item) => +item.value);

    const dailyCustomersLabels = customers.map((item) => {
        return formatDate.format(new Date(item.date))
    })

    const dailyCustomersData = customers.map((item) => +item.value);

    const documentStyle = getComputedStyle(document.documentElement);

    const revenueLineData = {
        labels: dailyRevenueLabels,
        datasets: [
            {
                label: 'Daily Revenue',
                data: dailyRevenueData,
                fill: true,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                tension: 0.4
            }
        ]
    }

    const ordersBarData = {
        labels: dailyOrdersLabels,
        datasets: [
            {
                label: 'Daily Orders',
                data: dailyOrdersData,
                backgroundColor: "rgba(255, 159, 64, 0.5)",
            }
        ]
    }

    const newCustomersLineData = {
        labels: dailyCustomersLabels,
        datasets: [
            {
                label: 'New Customers',
                data: dailyCustomersData,
                fill: true,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: documentStyle.getPropertyValue('--green-500'),
                tension: 0.4
            }
        ]
    }


    return (
        <Card className='shadow-l'>
            <TabView>
                <TabPanel header="Daily Revenue">
                    <Chart type="line" data={revenueLineData} options={commonLineOptions} style={{ height: '400px'}} />
                </TabPanel>
                <TabPanel header="Daily Orders">
                    <Chart type="bar" data={ordersBarData} options={commonLineOptions} style={{ height: '400px'}} />
                </TabPanel>
                <TabPanel header="Daily Revenue">
                    <Chart type="line" data={newCustomersLineData} options={commonLineOptions} style={{ height: '400px'}} />
                </TabPanel>
            </TabView>
        </Card>
    )
}