import { ChevronDown, DollarSign, FolderEditIcon,  GalleryHorizontalEnd, Image, Layout, MenuIcon,  SpaceIcon,  Sparkles, SquarePlay,     VideoIcon,     WandSparkles,  XIcon, Zap   } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import api from "../config/api";
import toast from "react-hot-toast";
import { userAuth } from "../context/AuthContext";
export default function Navbar() {
    // Clerk Authantication
    const {user} = useUser()
    const {openSignIn, openSignUp} = useClerk()
    // backend own authantication
    const {  
          logout } = userAuth()
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const [creadits, setCreadits] = useState(0)
    const {pathname} = useLocation()
    const { getToken } = useAuth()
   
    const getUserCredits = async ()=>{
        try {
            const token = await getToken()
            const {data} = await api.get('/api/user/credits',{
                headers:{Authorization: `Bearer ${token}`}
            })
            setCreadits(data.credits)
        } catch (error:any) {
            toast.error(error?.response?.data?.message || error.message)
            console.log(error)
        }
    }


    useEffect(()=>{
        if(user){
            (async ()=>await getUserCredits())()
        }

    },[user,pathname])
        return (
        <>
            <motion.nav className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                {/* logo */}
                <Link to="/">
                    <img className="h-8.5 w-auto" src="/logoAdvizi.png" alt="logo" width={130} height={34} />
                </Link>




                <div className="hidden md:flex items-center gap-8 transition duration-500">

                    <Link to='/' className="hover:text-pink-500 transition">Home</Link>

                    {/* Generate */}
                    <div className="relative inline-block group">
                        {/* Main Trigger Button */}
                        <button className="
        flex items-center gap-2  
        text-white   py-2.5 px-0 rounded-full  
        transition-all duration-300 ease-in-out transform  
        hover:text-pink-500 
      ">
                            <Sparkles size={18} className="text-indigo-200" />
                            <span>Generate</span>
                            <ChevronDown
                                size={16}
                                className="transition-transform duration-500 group-hover:rotate-180 opacity-70"
                            />
                        </button>

                        {/* Glassmorphism Tooltip / Dropdown */}
                        <div className="
        absolute left-0 mt-3 w-64 p-2 rounded-2xl
        bg-white/40   backdrop-blur-3xl   shadow-2xl
        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
        translate-y-4 group-hover:translate-y-0
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-50
      ">
                            <div className="flex flex-col gap-1">
                                {/* Option 1: Generate Thumbnails */}
                                
                                <Link
                                
                                    to={user ? '/generate' : `#`}
                                    onClick={()=>openSignIn()}
                                    className="
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white 
              hover:bg-white/20 transition-all duration-200 group/item 
            "
                                >
                                    <div className="p-2 bg-white/10 rounded-lg group-hover/item:bg-pink-500 transition-colors">
                                        <Image size={18} />
                                    </div>
                                    <div className="flex flex-col  ">
                                        <span className="font-semibold ">Generate Thumbnails</span>
                                        <span className="text-[10px]  ">High-clickrate designs</span>
                                    </div>
                                </Link>

                                {/* Option 2: Generate AI Ads */}
                                <Link
                                    to={user ? '/generate-Ads' : `#`}
                                    onClick={()=>openSignIn()}
                                    className="
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white 
              hover:bg-white/20 transition-all duration-200 group/item
            "
                                >
                                    <div className="p-2 bg-white/10 rounded-lg group-hover/item:bg-pink-500 transition-colors">
                                        <Layout size={18} />
                                    </div>
                                    <div className="flex flex-col   ">
                                        <span className="font-semibold">Generate AI Ads</span>
                                        <span className="text-[10px]  ">Conversion optimized</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* my Generation */}
                    {
                        user &&
                            <div className="relative inline-block group">
                                {/* Main Trigger Button */}
                                <button className="
        flex items-center gap-2  
        text-white py-2 px-0 rounded-full  
        transition-all duration-300 ease-in-out transform  
        hover:text-pink-500 
      ">
                                    <WandSparkles size={18} className="text-indigo-200" />
                                    <span>My Generation</span>
                                    <ChevronDown
                                        size={16}
                                        className="transition-transform duration-500 group-hover:rotate-180 opacity-70"
                                    />
                                </button>

                                {/* Glassmorphism Tooltip / Dropdown */}
                                <div className="
        absolute left-0 mt-3 w-64 p-2 rounded-2xl
        bg-white/40   backdrop-blur-3xl   shadow-2xl
        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
        translate-y-4 group-hover:translate-y-0
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-50
      ">
                                    <div className="flex flex-col gap-1">
                                        {/* Option 1: Thumbnails Show */}
                                        <Link
                                            to="/my-genration"
                                            className="
              flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white 
              hover:bg-white/20 transition-all duration-200 group/item 
            "
                                        >
                                            <div className="px-2 py-1 bg-white/10 rounded-lg group-hover/item:bg-pink-500 transition-colors">
                                                <SquarePlay size={18} />
                                            </div>
                                            <div className="flex flex-col  ">
                                                <span className="font-semibold "> Thumbnails</span>
                                            </div>
                                        </Link>

                                        {/* Option 2:  AI Ads Show */}
                                        <Link
                                            to="/ads-my-generation"
                                            className="
              flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white 
              hover:bg-white/20 transition-all duration-200 group/item
            "
                                        >
                                            <div className="px-2 py-1 bg-white/10 rounded-lg group-hover/item:bg-pink-500 transition-colors">
                                                <Zap size={18} />
                                            </div>
                                            <div className="flex flex-col   ">
                                                <span className="font-semibold"> AI Ads</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            // :
                            // <Link to='#' className="hover:text-pink-500 transition"> About</Link>


                    }


                    {/* community */}
                    <div className="relative inline-block group">
                                {/* Main Trigger Button */}
                                <button className="
        flex items-center gap-2  
        text-white py-2 px-0 rounded-full  
        transition-all duration-300 ease-in-out transform  
        hover:text-pink-500 
      ">
                                    <span> Community</span>
                                    <ChevronDown
                                        size={16}
                                        className="transition-transform duration-500 group-hover:rotate-180 opacity-70"
                                    />
                                </button>

                                {/* Glassmorphism Tooltip / Dropdown */}
                                <div className="
        absolute left-0 mt-3 w-64 p-2 rounded-2xl
        bg-white/40   backdrop-blur-3xl   shadow-2xl
        opacity-0 invisible group-hover:opacity-100 group-hover:visible 
        translate-y-4 group-hover:translate-y-0
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-50
      ">
                                    <div className="flex flex-col gap-1">
                                        {/* Option 1: Thumbnails Show */}
                                        <Link
                                            to="/community"
                                            className="
              flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white 
              hover:bg-white/20 transition-all duration-200 group/item 
            "
                                        >
                                            <div className="px-2 py-1 bg-white/10 rounded-lg group-hover/item:bg-pink-500 transition-colors">
                                                <Image size={18} />
                                            </div>
                                            <div className="flex flex-col  ">
                                                <span className="font-semibold "> Thumbnails</span>
                                            </div>
                                        </Link>

                                        {/* Option 2:  AI Ads Show */}
                                        <Link
                                            to="/ads-community"
                                            className="
              flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-white 
              hover:bg-white/20 transition-all duration-200 group/item
            "
                                        >
                                            <div className="px-2 py-1 bg-white/10 rounded-lg group-hover/item:bg-pink-500 transition-colors">
                                                <VideoIcon size={18} />
                                            </div>
                                            <div className="flex flex-col   ">
                                                <span className="font-semibold"> AI Ads</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>


                    <Link to='/plans' className="hover:text-pink-500 transition"> Plans</Link>


                </div>
                 {/* Authantication  */}
                 
                 <div className=" flex items-center gap-2">
                    {
                    !user ? (
                        <div className="hidden md:flex items-center gap-3">
                        <button onClick={()=>openSignIn()}
                         className="text-sm font-medium text-gray-300 
                         hover:text-white transition max-sm:hidden">
                            Sign In
                        </button>
                        <button
                                onClick={() =>  openSignUp()}
                                className="hidden md:block sm:px-4 sm:py-1.5 sm:text-xs px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full">
                                Get Started
                            </button>
                     </div>

                    ) :(
                       <div className="flex gap-2 me-2">
                        <button 
                        className="bg-white/10 rounded-2xl p-2 me-2 text-sx sm:text-xs"
                        onClick={()=>navigate('/plans')}>
                            Creadits: {creadits}
                        </button>
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action 
                                label="Generate" 
                                labelIcon={<SpaceIcon size={14}/>} 
                                onClick={()=>navigate('/generate')} />
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Action 
                                label="My Generation" 
                                labelIcon={<FolderEditIcon size={14}/>} 
                                onClick={()=>navigate('/my-genration')} />
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Action 
                                label="Community" 
                                labelIcon={<GalleryHorizontalEnd size={14}/>} 
                                onClick={()=>navigate('/community')} />
                            </UserButton.MenuItems>
                            <UserButton.MenuItems>
                                <UserButton.Action 
                                label="Plans" 
                                labelIcon={<DollarSign size={14}/>} 
                                onClick={()=>navigate('/plans')} />
                            </UserButton.MenuItems>
                            

                        </UserButton>
                         
                         
                       </div> 
                    )
                 }
                     {
                        !user &&
                        <button onClick={() => setIsOpen(true)} className="md:hidden">
                        <MenuIcon size={26} className="active:scale-90 transition" />
                    </button>

                     }
                </div>
                

            </motion.nav>

            <div className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <Link onClick={() => setIsOpen(false)} to='/'>Home</Link>
                {
                    user ? 
                <Link onClick={() => setIsOpen(false)} to='/generate'>Generate Thumbnails</Link>
                :
                <button onClick={() => {setIsOpen(false),  openSignIn()}} >Generate Thumbnails</button>
                }
                            <Link onClick={() => setIsOpen(false)} to='/community' > Community</Link>


                {
                    user && (
                        <>
                            <Link onClick={() => setIsOpen(false)} to='/my-genration'>My Generations</Link>

                        </>)


                        // {/* : */}
                        // {/* <Link onClick={() => setIsOpen(false)} to='#'>About</Link> */}


                }
                <Link onClick={() => setIsOpen(false)} to='/plans'>Plans</Link>
                {
                    user ?
                        <button onClick={() => { setIsOpen(false); logout() }}>
                            Logout
                        </button>
                        :
                        <button onClick={() => {setIsOpen(false),openSignIn()}} >Login</button>



                }


                <button onClick={() => setIsOpen(false)} className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex">
                    <XIcon />
                </button>
            </div>
        </>
    );
}