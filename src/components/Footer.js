import React from 'react'





const Footer = () => {
  
    return (
      <div className='w-screen flex  border relative   font-product   '>
       
         <img className='w-full lg:flex hidden absolute  h-[50vh] ' src='https://vitamu.imgix.net/svg-4.png?w=1316&h=1380&rect=902%2C0%2C1316%' alt='vawe'/>
         <img className='w-full lg:hidden flex absolute  h-full ' src='https://vitamu.imgix.net/svg-12.png?w=1316&h=1380&rect=902%2C0%2C1316%2C1380' alt='vawe'/>
          
          <div className='w-full flex lg:h-[80%]  z-30 lg:pl-40 lg:pr-20 pl-0 pr-0 lg:pb-0 pb-16  '>  
          
             <div className='lg:w-[50%] w-full flex flex-col lg:gap-6 gap-4 h-full lg:pt-16 pt-0 px-8   '>
              <img className='w-40'  src='https://vitamu.imgix.net/MEDIFYRE%20Kopyas%C4%B1-4.png?w=2048&h=601&auto=compress&rect=0%2C254%2C2048%2C601' alt='medifyre logo'/>
              <p className='text-white  cursor-pointer'>Terms of Service · Privacy Policy</p>

                 <div  className=" flex relative text-sm font-product "> 

       

<p className='bg-white px-12 py-2 rounded-xl text-second w-fit'>Get Started</p>
    
     </div>
        
         
              
       
       
       
              <p className='text-white opacity-75 text-sm lg:w-[70%] w-full'>These statements have not been evaluated by the FDA or NHS. This service is not intended to treat or cure any disease</p>
              <img className='w-40 '  src='https://vitamu.imgix.net/77a9a243-69ff-47d8-9e26-0b340f0a25f4.png?w=389&h=121&rect=0%2C0%2C389%2C121' alt='visa mastercard logo'/>
              <p className='text-white'>Medifyre© 2024 All Rights Reserved</p>
             </div>








             <div className='w-[50%]  lg:flex hidden  pb-7 h-[70%] self-end text-white   items-center px-10'>
              
             <div className='flex flex-col gap-10 w-full  '> 
             
               <div className='flex flex-col'>
                <h1 className=' w-full text-lg font-bold'>Services</h1>
                <div className='flex flex-wrap gap-5 mt-2'>
                 
                  <div  className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p> <p>MRI</p> </div> 
                  <div  className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p> <p>Mammogram</p> </div> 
                  <div  className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p> <p>CT Scan</p> </div> 
                  <div className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p> <p>X-Ray</p> </div> 
                  <div  className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p> <p>Full Body Scan</p> </div> 
                  <div  className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p> <p>Pregnancy</p> </div> 
              
                </div>

               </div>
             
               <div className='flex flex-col'>
                <h1 className=' w-full text-lg font-bold  ' >About</h1>
                <div className='flex flex-wrap gap-5 mt-2'>
                
                 <div className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p> <p> Sample Reports</p> </div> 
               <div className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p> <p>Why Second Opinion</p> </div> 
               <div className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p> <p>How It Works</p> </div> 
                 <div className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p><p>Contact</p> </div>  
                <div className='flex gap-1 items-center justify-center hover:opacity-60 duration-500 cursor-pointer'> <p>•</p><p>FAQ</p> </div> 
              
                </div>

               </div>
             
             
              </div>
             
            
             </div>
             

          </div>
      


       
    </div>
  )
}

export default Footer
