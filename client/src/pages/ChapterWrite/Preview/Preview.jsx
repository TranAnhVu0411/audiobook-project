import React from 'react';
import './style.scss';

const Preview = (props) => {
    return (
        <div className='preview'>
            <div className='image-show'>
                {props.image.imageShow ? (
                    <img src={props.image.imageShow} alt="previewimage" />
                ):("Click image to preview")}
            </div>
            <div className='info'>
                No info here
            </div>
        </div>
    )
}

export default Preview;