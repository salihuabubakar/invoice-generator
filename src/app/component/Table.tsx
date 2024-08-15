import React, { useEffect } from 'react'
import { Data as data } from './Data';
import { useState } from "react";
import { Poppins } from "next/font/google";
import useDocument from "../../hook/useDocument";
import { toast } from 'react-toastify';
import { DocData, dateFormatter } from '@/utils/data_types';
import AddInvoice from './AddInvoice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { deleteDocument } from '@/lib/slices/documentsSlice';
import { openModal } from '@/lib/slices/modalSlice';


const poppins = Poppins({
  weight: '400',
  subsets: ['latin'],
})

const Table = () =>{

  const { documents, loading, error } = useDocument(
    '66b8157100055f93735c',
    '66b8158c001b36a48c99',
  );

  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector((state) => state.modal.open);


  useEffect(() => {
    if(error) {
      toast.error(error);
    }
  },[error])

  const [users] = useState(data);
  const [search, setSearch] = useState("");
  const [sorted, setSorted] = useState({ reversed: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [docId, setDocId] = useState<string>('');
  const [docIndex, setDocIndex] = useState<number | string>('');
  const [existingData, setExistingData] = useState<any[]>([]);

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
    setDocIndex(index);
    setExistingData(documents);
    dispatch(openModal());
  }

    //-----------------------------START Sort Table Function---------------------------
    const sortFunction = (e: any) => {
      const usersCopy = users;
  
      //Sort First Name Column
      if (e === "sortByName") {
        usersCopy.sort((a, b) => {
          if (sorted.reversed) {
            //Descending
            return b.first_name.localeCompare(a.first_name);
          }
          //Ascending
          return a.first_name.localeCompare(b.first_name);
        });
        setSorted({ reversed: !sorted.reversed });
      }
  
      //Sort Last Name Column
      else if (e === "sortByLastName") {
        usersCopy.sort((a, b) => {
          if (sorted.reversed) {
            return b.last_name.localeCompare(a.last_name);
          }
          return a.last_name.localeCompare(b.last_name);
        });
        setSorted({ reversed: !sorted.reversed });
      }
    };
  
    //-----------------------------END Sort Table Function-----------------------------

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

  if (loading) return <div>Loading...</div>;


  return (
    <div>
      {/* Start Search Input */}
      <div className='flex justify-between'>
        <input 
          className="flex rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 w-40 lg:w-64" 
          placeholder="Search..." 
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
              <div>ID</div>
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
              <div>Items Desc</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Items Quantity</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Items Unit</div>
            </th>
            <th className="text-left font-medium px-3 text-xs h-8"> 
              <div>Items Price</div>
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
                  items_price, items_quantity, items_unit
                } = docs;
                return (
                  <tr 
                    className='border-b'
                    key={docs.$id}>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        {$id}
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        {customer_id}
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}>
                        {name}
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}>
                        {phone_number}
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}>
                        {email}
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        {address}
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[8.25rem] truncate font-medium ${poppins.className}`}>
                        {dateFormatter(date)}
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[8.25rem] truncate font-medium ${poppins.className}`}>
                        {dateFormatter(valid_until)}
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        {quote}
                      </td>
                      <td className={`p-2 align-middle text-left text-sm max-w-[5.25rem] truncate font-medium ${poppins.className}`}>
                        {description_of_work}
                      </td>
                      <td 
                        className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}
                        style={{ opacity: 1, position: 'relative', width: '150px', zIndex: 0 }}
                        >
                          {items_description?.map((data, index) => (
                            <span key={index}>
                              {data}
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
                              {data}
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
                              {data}
                              <br />
                            </span>
                          ))}
                      </td>
                      <td 
                        className={`p-2 align-middle text-left text-sm max-w-[10.25rem] truncate font-medium ${poppins.className}`}
                        style={{ opacity: 1, position: 'relative', width: '150px', zIndex: 0 }}
                        >
                          {items_price?.map((data: any, index) => (
                            <span key={index}>
                              {Number.isInteger(data) ? data.toFixed(2) : data}
                              <br />
                            </span>
                          ))}
                      </td>
                      <td 
                        className='p-2 align-middle text-left text-sm truncate font-medium'
                        style={{ opacity: 1, position: 'relative', width: '150px', zIndex: 0 }}
                        >
                          <button
                            onClick={() => handleEdit($id, index)}
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                            >
                              Edit
                          </button>
                          <button
                            onClick={() => { 
                              confirm("Are you sure you want to delete this invoice?");
                              dispatch(deleteDocument($id));
                              toast.success('Deleted Successfully')
                            }}
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#FE4066] shadow-md hover:bg-[#f75878] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                            >
                              Delete
                          </button>
                          <button
                            onClick={() => alert("Coming Soon..")}
                            className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-[#2B83BE] shadow-md hover:bg-[#3cb0fd] text-[white] hover:text-accent-foreground h-8 rounded-md px-3 text-xs"
                            >
                              Print
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
        <div className='flex items-center p-2'>
          <p className='whitespace-nowrap text-sm font-medium'>Rows per page</p>
        <input 
          className="rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 h-8 w-10 lg:w-20" 
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
        />
      )}
    </div>
  );
}
export default Table;
