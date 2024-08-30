import React from 'react'

const Footer = () => {
    return (
        <div className=" border-top border-5 footer mt-5 text-center container-fluid d-flex justify-content-between navbar-expand-lg py-1 custom-bg fixed-bottom bg-dark">
            <div className='text-light'>Made by <strong>Ignacio Quirós</strong></div>
            <div className="m-2">
                <a href="https://github.com/IgnacioQuiros" className="m-2 text-light">Github!</a>
                <a href="https://es.linkedin.com/in/ignacio-quir%C3%B3s-sordo-137781184" className="my-0 text-light">Linkedin!</a>
            </div>
        </div>
    )
}

export default Footer