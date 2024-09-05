import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { account } from '../appwrite';
import getCurrentUser from '../../hook/getCurrentUser';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { openProfile } from '@/lib/slices/profileModalSlice';
import ProfileModal from './ProfileModal';
import { Popup, Segment } from 'semantic-ui-react';

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
        <div>
          <Popup
            style={{
              border: "1px solid #3cb0fd",
            }}
            inline
            hoverable
            position="bottom left"
            content={
              <Segment.Group>
                    <Segment>
                      <div className="ui column relaxed divided grid">
                        <div className="column">
                          <div className="ui link list">
                            <button
                              className='inline-flex text-center items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs'
                              type="button" 
                              onClick={() => dispatch(openProfile())}>Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </Segment>
                    <Segment>
                      <div className="ui column relaxed divided grid">
                        <div className="column">
                          <div className="ui link list">
                            <button
                              className='inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#FE4066] shadow-md hover:bg-[#f75878] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs'
                              type="button" 
                              onClick={logout}>Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    </Segment>
              </Segment.Group>
            }
            trigger={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#2a77ad" fill="none">
                <path d="M8 6H8.00635M8 12H8.00635M8 18H8.00635M15.9937 6H16M15.9937 12H16M15.9937 18H16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            }
          />
          {/* {isDropdownVisible && (
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
            )} */}
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
