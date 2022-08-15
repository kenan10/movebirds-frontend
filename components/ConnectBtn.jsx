import Button from './Button'
import useWeb3 from '../hooks/useWeb3'

function ConnectBtn({ onActiveClick, activeText, className }) {
    const { connect, active } = useWeb3()
    return (
        <Button
            onClick={() => {
                if (active) {
                    onActiveClick()
                } else {
                    connect()
                }
            }}
            className={className}>
            {active ? activeText : 'Connect Wallet'}
        </Button>
    )
}

export default ConnectBtn
