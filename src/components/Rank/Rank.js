import React from 'react';

const Rank = ({ name, userRank, id })=>{

	return(
		<div>
			<div className='f3 white'>
				{`${name} (ID-${id}), your entry count is`}
			</div>
			<div className='f3 white'>
				{userRank}
			</div>
		</div>
		);
}

export default Rank