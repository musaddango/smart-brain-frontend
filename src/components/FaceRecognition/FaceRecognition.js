import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
  return(
		<div className='center' 
			style={{height:'auto', width:'300px', marginTop:'5px', position:'relative', borderRadius: '5px'}}>
			<img id='inputimage' alt='' src={imageUrl} />
			<div className='boundingBox' 
				 style={{top: box.top_row, left: box.left_col, bottom: box.bottom_row, right: box.right_row}}>
			</div>
		</div>
		);
}

export default FaceRecognition;