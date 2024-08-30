import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { account } from '../appwrite';
import getCurrentUser from '../../hook/getCurrentUser';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { openProfile } from '@/lib/slices/profileModalSlice';
import ProfileModal from './ProfileModal';

const Header = () =>{
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isProfileModalOpen = useAppSelector((state) => state.profileModal.open);
  const { currentUser, loading } = getCurrentUser();
  const [isDropdownVisible, setDropdownVisible] = useState(false);


  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, loading, router]);

  const logout = async () => {
    await account.deleteSession("current");
    router.push('/');
  };

  const handleMouseEnter = () => {
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setDropdownVisible(false);
  };
  return (
    <>
      <header className="topnav boader shadow-md">
        <div className='header_img'>
          <Image alt="logo image" className="Headerlogo" width={110} height={10} src="/Logo.webp" />
        </div>
        <strong>ADMIN DASHBOARD</strong>
        <div 
          className="menu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4" aria-hidden="true"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </button>
          {isDropdownVisible && (
              <div className="dropdown-menu">
                <ul>
                  <li>
                    <button
                      className='inline-flex text-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs'
                      type="button" 
                      onClick={() => dispatch(openProfile())}>Profile
                    </button>
                  </li>
                  <li>
                    <button
                      className='inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#FE4066] shadow-md hover:bg-[#f75878] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs'
                      type="button" 
                      onClick={logout}>Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
        </div>
      </header>

    {isProfileModalOpen && (
        <ProfileModal 
          dispatch={dispatch}
        />
      )}
    </>
  )
}
export default Header;
