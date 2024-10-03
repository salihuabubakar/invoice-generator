import React, { useEffect } from 'react'
import { useState } from "react";
import { Poppins } from "next/font/google";
import useDocument from "../../hook/useDocument";
import { toast } from 'react-toastify';
import { DocData, dateFormatter } from '@/utils/data_types';
import AddInvoice from './AddInvoice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { deleteDocument } from '@/lib/slices/documentsSlice';
import { openModal } from '@/lib/slices/modalSlice';
import EmailTemplate from './EmailTemplate';
import { render } from '@react-email/components';
import axios from 'axios';
import PopUpText from './PopUpText';
import useCurrentUser from '@/hook/getCurrentUser';
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import PdfTemplate from './PdfTemplate';



interface EmailTemplateProps {
  $id: string;
  customer_id: string;
  name: string;
  phone_number: string;
  email: string;
  address: string;
  date: string;
  valid_until: string;
  quote: string;
  description_of_work: string;
  items_description: string[];
  items_quantity: number[];
  items_unit: number[];
  items_amount: number[];
}


const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

const Table = () =>{

  const { documents, loading, error } = useDocument(
    process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID as string
  );

  const { currentUser } = useCurrentUser();

  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector((state) => state.modal.open);


  useEffect(() => {
    if(error) {
      toast.error(error);
    }
  },[error])

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [docId, setDocId] = useState<string>('');
  const [docIndex, setDocIndex] = useState<number | string>('');
  const [existingData, setExistingData] = useState<any[]>([]);
  const [emailSendingState, setEmailSendingState] = useState<boolean>(false);

  useEffect(() => {
    if (!isModalOpen) {
      setExistingData(['']);
      setDocId('');
      setDocIndex('')
    }
  }, [isModalOpen]);

  // Edit function
  const handleEdit = (id: string, index: number) => {
    setDocId(id);
    setDocIndex((currentPage - 1) * postsPerPage + index);
    setExistingData(documents);
    dispatch(openModal());
  }

      //-----------------------------START PAGINATION Table Function---------------------
  let paginationBtn = [];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  for (
    let i = 1;
    i <= Math.ceil(documents.length / (postsPerPage ? postsPerPage : documents.length));
    i++
  ) {
    paginationBtn.push(i);
  }

  //-----------------------------END PAGINATION Table Function-----------------------

  const searchFn = (e: any) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1);
  };
  const paginationFn = (e: any) => {
    setPostsPerPage(e.target.value);
    setCurrentPage(1);
  };

  const sendEmail = async (data: EmailTemplateProps) => {

    setEmailSendingState(true);
    setDocId(data.$id);

    const payload = {
      to: data.email,
      subject: 'Invoice Receipt',
      html: render(
        <EmailTemplate
          $id={data.$id} 
          customer_id={data.customer_id} 
          name={data.name} 
          phone_number={data.phone_number}
          email={data.email}
          address={data.address}
          date={data.date}
          valid_until={data.valid_until}
          quote={data.quote} 
          description_of_work={data.description_of_work} 
          items_description={data.items_description}
          items_quantity={data.items_quantity}
          items_unit={data.items_unit}
          items_amount={data.items_amount}
          currentUser={currentUser}
        />
      ),
    }

    try {
      const response = await axios.post('/api/sendEmail', payload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response.status === 201) {
        toast.success("Email sent successfully");
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error('Error sending email', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    } finally {
      setEmailSendingState(false);
    }
  };
  

  if (loading) return <div>Loading...</div>;


  return (
    <div>
      {/* Start Search Input */}
      <div className='flex justify-between'>
        <input 
          className="flex rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 w-100 lg:w-64" 
          placeholder="Search... email, customer id, name" 
          type="search"
          onChange={searchFn}
        />
        <button
          onClick={() => dispatch(openModal())}
          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring  border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 size-4"><path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg> Add Invoice
        </button>
      </div>
      {/* End Search Input */}

      {/* Start Table */}
      <div className='table_wrapper rounded-md border border-input mt-2'>
      <table className={`rounded-md border`}>
        <thead className=''>
          <tr className='border-b'>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>SN</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Customer ID</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Name</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Phone Number</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Email</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Address</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Date</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Valid Until</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Quote</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Desc of work</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Items</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Quantity</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Unit Price</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Amount</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8">
              <div>Action</div>
            </th>
          </tr>
        </thead>
        <tbody className='[&_tr:last-child]:border-0'>
          {documents && documents?.length !== 0 ? (
            <>
              {documents
              .filter(
                (doc) =>
                  doc.customer_id.toLowerCase().includes(search) ||
                  doc.name.toLowerCase().includes(search) ||
                  doc.email.toLowerCase().includes(search)
              )
              .slice(indexOfFirstPost, indexOfLastPost) //Table (startFrom, endFrom )
              .map((docs: DocData, index: number) => {
                const { 
                  $id, name, customer_id, phone_number, 
                  email, address, date, valid_until, 
                  description_of_work, quote, items_description, 
                  items_amount, items_quantity, items_unit
                } = docs;
                const actualIndex = (currentPage - 1) * postsPerPage + index + 1;
                return (
                  <tr 
                    className='border-b'
                    key={$id}>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={actualIndex} />
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={customer_id} />
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={name} />
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={phone_number} />
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={email} />
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={address} />
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[8.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={dateFormatter(date)} />
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[8.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={dateFormatter(valid_until)} />
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={quote} />
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        <PopUpText text={description_of_work} />
                      </td>
                      <td 
                        className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}
                        style={{ opacity: 1, position: 'relative', width: '150px', zIndex: 0 }}
                        >
                          {items_description?.map((data, index) => (
                            <span key={index}>
                              <PopUpText text={data} />
                              <br />
                            </span>
                          ))}
                      </td>
                      <td 
                        className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}
                        style={{ opacity: 1, position: 'relative', width: '150px', zIndex: 0 }}
                        >
                          {items_quantity?.map((data, index) => (
                            <span key={index}>
                              <PopUpText text={data} />
                              <br />
                            </span>
                          ))}
                      </td>
                      <td 
                        className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}
                        style={{ opacity: 1, position: 'relative', width: '150px', zIndex: 0 }}
                        >
                          {items_unit?.map((data, index) => (
                            <span key={index}>
                              <PopUpText text={data} />
                              <br />
                            </span>
                          ))}
                      </td>
                      <td 
                        className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}
                        style={{ opacity: 1, position: 'relative', width: '150px', zIndex: 0 }}
                        >
                          {items_amount?.map((data: any, index) => (
                            <span key={index}>
                              <PopUpText text={Number.isInteger(data) ? data.toFixed(2) : data} />
                              <br />
                            </span>
                          ))}
                      </td>
                      <td 
                        className='p-2 align-middle items-center text-left text-sm truncate font-medium'
                        style={{ opacity: 1, position: 'relative', width: '150px', zIndex: 0 }}
                        >
                          <button
                            title='Edit'
                            onClick={() => handleEdit($id, index)}
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                            >
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.1338 3.11399L11.0099 2.23789C11.4937 1.75404 12.2782 1.75404 12.7621 2.23789C13.2459 2.72175 13.2459 3.50624 12.7621 3.99009L11.886 4.86619M10.1338 3.11399L6.86262 6.38519C6.20933 7.0385 5.88266 7.36512 5.66023 7.76319C5.43779 8.16125 5.214 9.10119 5 10C5.89881 9.786 6.83875 9.56219 7.23681 9.33975C7.63487 9.11731 7.9615 8.79069 8.61481 8.13737L11.886 4.86619M10.1338 3.11399L11.886 4.86619" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M13.125 7.5C13.125 10.1516 13.125 11.4775 12.3012 12.3012C11.4775 13.125 10.1516 13.125 7.5 13.125C4.84835 13.125 3.52252 13.125 2.69876 12.3012C1.875 11.4775 1.875 10.1516 1.875 7.5C1.875 4.84835 1.875 3.52252 2.69876 2.69876C3.52252 1.875 4.84835 1.875 7.5 1.875" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>

                          </button>
                          <button
                            title='Delete'
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this invoice?")) {
                                dispatch(deleteDocument($id));
                                toast.success('Deleted Successfully');
                              }
                            }}
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#FE4066] shadow-md hover:bg-[#f75878] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                            >
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.1875 3.4375L11.8002 9.70319C11.7012 11.304 11.6517 12.1044 11.2505 12.6799C11.0521 12.9644 10.7967 13.2046 10.5004 13.385C9.90131 13.75 9.09937 13.75 7.49544 13.75C5.88945 13.75 5.08644 13.75 4.48691 13.3843C4.1905 13.2036 3.935 12.963 3.73668 12.678C3.33555 12.1016 3.28716 11.3001 3.19038 9.697L2.8125 3.4375" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M1.875 3.4375H13.125M10.0348 3.4375L9.60819 2.55733C9.32475 1.97266 9.183 1.68033 8.93856 1.49801C8.88437 1.45756 8.82694 1.42159 8.76688 1.39044C8.49619 1.25 8.17131 1.25 7.52156 1.25C6.8555 1.25 6.5225 1.25 6.2473 1.39632C6.18631 1.42876 6.12811 1.46619 6.07331 1.50823C5.82602 1.69794 5.68789 2.00097 5.41163 2.60704L5.03308 3.4375" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M5.9375 10.3125V6.5625" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M9.0625 10.3125V6.5625" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>

                          </button>
                          <button
                            title='Download'
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                            >
                              <PDFDownloadLink 
                                document={
                                  <PdfTemplate
                                    $id={$id} 
                                    customer_id={customer_id} 
                                    name={name} 
                                    phone_number={phone_number}
                                    email={email}
                                    address={address}
                                    date={date}
                                    valid_until={valid_until}
                                    quote={quote} 
                                    description_of_work={description_of_work} 
                                    items_description={items_description}
                                    items_quantity={items_quantity}
                                    items_unit={items_unit}
                                    items_amount={items_amount}
                                    currentUser={currentUser}
                                  />
                                } 
                                fileName={`${name} ${customer_id} document.pdf`}>
                                {DownloadLinkContent}
                              </PDFDownloadLink>
                          </button>
                          <button
                            title='Send to email'
                            disabled={(emailSendingState && docId === $id)}
                            onClick={() => sendEmail(docs)}
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                            >
                              {
                                (emailSendingState && docId === $id)  ? (
                                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" color="#ffffff" fill="none">
                                    <path d="M12 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M12 18V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M21 12L18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M6 12L3 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M18.3635 5.63672L16.2422 7.75804" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M7.75804 16.2422L5.63672 18.3635" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M18.3635 18.3635L16.2422 16.2422" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M7.75804 7.75804L5.63672 5.63672" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                ) : 
                                (
                                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.75 7.81256C13.75 7.50544 13.7467 6.88575 13.7401 6.57775C13.6993 4.66179 13.6789 3.70381 12.9719 2.99416C12.2649 2.28452 11.2811 2.2598 9.31325 2.21036C8.10044 2.17988 6.89956 2.17988 5.68676 2.21035C3.71896 2.25979 2.73505 2.28451 2.02809 2.99416C1.32114 3.7038 1.30071 4.66178 1.25985 6.57775C1.24671 7.19381 1.24672 7.80619 1.25986 8.42225C1.30071 10.3383 1.32114 11.2962 2.0281 12.0059C2.73505 12.7155 3.71896 12.7402 5.68677 12.7896C6.18849 12.8023 6.68819 12.8096 7.1875 12.8118" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M1.25 3.75L5.57064 6.20289C7.14919 7.09906 7.85081 7.09906 9.42937 6.20289L13.75 3.75" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                                    <path d="M13.75 10.9375H8.75M13.75 10.9375C13.75 10.4999 12.5036 9.68219 12.1875 9.375M13.75 10.9375C13.75 11.3751 12.5036 12.1928 12.1875 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )
                              }
                          </button>
                      </td>
                  </tr>
                )
              })}
            </>
          ) : (
            <tr className='flex justify-center'><td className='flex justify-center'>No content to show</td></tr>
          )}
        </tbody>
      </table>
      </div>
      {/* End Table */}
      <div className='flex justify-end mt-2'>
        {/* Start Pagination Buttons */}
        <div className='flex items-center p-2 justify-center'>
          <p className='whitespace-nowrap flex items-center text-sm font-medium'>Rows per page</p>
          <input 
            className="rounded-md ml-[5px] mt-[-13px] flex items-center border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 w-10 lg:w-20" 
            value={postsPerPage}
            type="number"
            min={1}
            onChange={paginationFn}
          />
        </div>
        <p className='whitespace-nowrap text-sm font-medium flex items-center'>Page {currentPage} of {paginationBtn.length}</p>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4" aria-hidden="true"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </button>
        <button
          disabled={currentPage === Math.ceil(documents.length / postsPerPage)}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4" aria-hidden="true"><path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
        </button>

        {/* End Pagination Buttons */}
      </div>

      {isModalOpen && (
        <AddInvoice 
          docId={docId}
          docIndex={docIndex}
          existingData={existingData}
          dispatch={dispatch}
          documents={documents}
        />
      )}
    </div>
  );
}
export default Table;

const DownloadLinkContent = (
  <span>
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.59623 11.25C3.26928 11.25 2.6058 11.25 2.13343 10.9668C1.82471 10.7816 1.57599 10.5169 1.41547 10.2026C1.16987 9.72169 1.23589 9.08581 1.36793 7.81406C1.47815 6.75244 1.53326 6.22159 1.80428 5.83176C1.98221 5.57581 2.22287 5.36602 2.50498 5.22096C2.93468 5 3.48853 5 4.59623 5H10.4038C11.5115 5 12.0653 5 12.495 5.22096C12.7771 5.36602 13.0178 5.57581 13.1958 5.83176C13.4668 6.22159 13.5219 6.75244 13.6321 7.81406C13.7641 9.08581 13.8301 9.72169 13.5845 10.2026C13.424 10.5169 13.1753 10.7816 12.8666 10.9668C12.3942 11.25 11.7308 11.25 10.4038 11.25"
        stroke="white"
        strokeWidth="1.5"
      />
      <path
        d="M10.625 5V3.75C10.625 2.57149 10.625 1.98223 10.2589 1.61612C9.89275 1.25 9.3035 1.25 8.125 1.25H6.875C5.69649 1.25 5.10723 1.25 4.74112 1.61612C4.375 1.98223 4.375 2.57149 4.375 3.75V5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.74294 10H6.25706C5.82876 10 5.61461 10 5.43239 10.0681C5.18944 10.1588 4.98141 10.335 4.84138 10.5687C4.73634 10.744 4.68441 10.9694 4.58053 11.4202C4.41821 12.1247 4.33705 12.4769 4.39224 12.7593C4.46584 13.1359 4.69523 13.4546 5.01408 13.6234C5.25321 13.75 5.58783 13.75 6.25706 13.75H8.74294C9.41219 13.75 9.74681 13.75 9.98594 13.6234C10.3048 13.4546 10.5342 13.1359 10.6078 12.7593C10.6629 12.4769 10.5818 12.1247 10.4195 11.4202C10.3156 10.9694 10.2636 10.744 10.1586 10.5687C10.0186 10.335 9.81056 10.1588 9.56763 10.0681C9.38538 10 9.17125 10 8.74294 10Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 7.5H11.256"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);
