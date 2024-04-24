import classes from './UserHeader.module.scss'
import headerLogo from '../../../images/Tao one den.png'

function UserHeader() {
  return (
   <>
      <div className={classes.header}>
         <div className={classes.header_main}>
            <div className={`${classes.header_left}`}>
               <a href="/" title='Trang chủ'>
                  <img className={classes.logo} src={headerLogo} alt='Logo'/>
               </a>
            </div>
            <div className={`${classes.header_center}`}>
               <ul>
                  <li>Watch</li>
                  <li>iPad</li>
                  <li>Macbook</li>
                  <li>Airpods</li>
                  <li>Phụ kiện</li>
                  <li>Tin tức</li>
               </ul>
            </div>
            <div className={`${classes.header_right}`}>
               <span className={classes.item}>
                  <i className='pi pi-search' style={{color: 'white'}}></i>
               </span>
               <span className={classes.item}>
                  <i className='pi pi-shopping-bag' style={{color: 'white'}}></i>
               </span>
            </div>
         </div>
      </div>
   </>
  )
}

export default UserHeader;
