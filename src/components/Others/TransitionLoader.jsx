// Project Components and Dependencies
import { PropagateLoader, PuffLoader } from "react-spinners";

// Project Components
import { OtherNavbar } from '../Navbar/Navbar';

// Styles
import './TransitionLoader.css';
const TransitionLoader = ({loaderType, navbar, message}) => {
    return(
        <>
            {navbar && <OtherNavbar />}
            <div className='form-submit-loading'>
                <div className='spinner-wrapper'>
                    {loaderType === 'puff' && 
                    <>
                        <PuffLoader
                            color={"#75492c"} 
                            loading={true} 
                            size={150} 
                            aria-label="Loading Spinner" 
                        />
                        <span>{message}</span>
                    </>
                    }
                    {loaderType === 'propagate' &&
                        <PropagateLoader
                         color={"#75492c"} 
                         loading={true} 
                         aria-label="Loading Spinner" 
                    />}
                </div>
            </div>
        </>
    )
}

export default TransitionLoader