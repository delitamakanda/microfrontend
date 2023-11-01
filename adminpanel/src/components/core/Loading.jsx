import { ProgressSpinner } from 'primereact/progressspinner';


export const Loading = () => {
    return <ProgressSpinner aria-label='Loading'  style={{width: '50px', height: '50px'}} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s"  />
}