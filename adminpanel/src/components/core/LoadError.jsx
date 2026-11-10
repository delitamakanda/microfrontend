/* eslint-disable react/prop-types */
import { Component } from 'react'
import { Button } from 'primereact/button'

// Standalone fallback: must not depend on the federated remote (nor on auth).
export const LoadError = ({ message = 'The back office could not load a required module. Please retry.' }) => (
    <div
        role="alert"
        className="flex flex-column align-items-center justify-content-center text-center p-4"
        style={{ minHeight: '100vh' }}
    >
        <h1 className="text-2xl font-semibold m-0 mb-3" style={{ color: '#1f2937' }}>Something went wrong</h1>
        <p className="m-0 mb-4" style={{ color: '#374151', maxWidth: '28rem' }}>{message}</p>
        <Button label="Retry" icon="pi pi-refresh" onClick={() => window.location.reload()} />
    </div>
)

export class ErrorBoundary extends Component {
    state = { error: null }

    static getDerivedStateFromError(error) {
        return { error }
    }

    componentDidCatch(error, info) {
        console.error('Admin render error:', error, info?.componentStack)
    }

    render() {
        if (this.state.error) {
            return <LoadError message="An unexpected error occurred. Please retry." />
        }
        return this.props.children
    }
}
