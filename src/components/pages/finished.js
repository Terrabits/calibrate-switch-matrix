import React    from 'react';

import '../../assets/css/finished-page.scss';
import allTheThings from '../../assets/images/all the things.jpg';

function FinishedPage(props) {
  let classes = props.invisible ? 'invisible page' : 'page';
  return(
    <div id="finished-page" className={classes}>
      <h2 className="no-margin-top center">You measured all the things!</h2>
      <img id="all-the-things" src={allTheThings} />
    </div>
  );
}

export default FinishedPage;
