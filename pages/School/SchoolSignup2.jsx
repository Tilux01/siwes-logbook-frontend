import React, { useEffect, useRef, useState, useContext } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { uploadImg } from '../../Cloudinary'
import { context } from '../../src/App'
import axios from 'axios'

const SchoolSignup2 = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { setSchoolCred } = useContext(context)

    useEffect(() => {
        if (!location?.state) return navigate("/")
    }, [])

    const data = location?.state
    const [CAC_Image, setCAC_Image] = useState()
    const [Certificte, setCertificte] = useState("")
    const [Contact_Adress, setContact_Adress] = useState("")
    const [Profile_Img, setProfile_Img] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const profileUrl = useRef()
    const cacUrl = useRef()

    const convertImg = (file) => {
        if (!file) return;
        const reader = new FileReader()
        reader.addEventListener("load", (event) => {
            profileUrl.current = event.target.result
            setProfile_Img(event.target.result)
        })
        reader.readAsDataURL(file)
    }

    const convertCAC = (file) => {
        if (!file) return;
        const reader = new FileReader()
        reader.addEventListener("load", (event) => {
            cacUrl.current = event.target.result
            setCAC_Image(event.target.result)
        })
        reader.readAsDataURL(file)
    }

    const handleDragOver = (e) => e.preventDefault();

    const signUp = async (e) => {
        e.preventDefault()
        if (!Contact_Adress || !Certificte) {
            return alert("Please fill in every detail")
        }
        if (!cacUrl.current) {
            return alert("Your institution CAC registration certificate image is required")
        }
        setIsLoading(true)
        let profileLink = null;
        let cacLink = null;

        try {
            if (profileUrl.current) {
                const resProfile = await uploadImg(profileUrl.current, 40)
                if (resProfile?.error) {
                    setIsLoading(false)
                    return alert("Profile image upload failed")
                }
                profileLink = resProfile
            }

            const resCac = await uploadImg(cacUrl.current)
            if (resCac?.error) {
                setIsLoading(false)
                return alert("CAC certificate upload failed")
            }
            cacLink = resCac

            const payload = {
                Name: data?.Name,
                Mail: data?.Mail,
                password: data?.password,
                Location: data?.Location,
                CAC_Image: cacLink,
                Certificte: Certificte,
                Contact_Adress: Contact_Adress,
                Profile_Img: profileLink,
                otp_code: data?.otpCode
            }

            axios.post("http://localhost:5687/school/signup", payload)
                .then((res) => {
                    alert("Institution account registered successfully!")
                    setSchoolCred(payload)
                    navigate("/school/dashboard")
                })
                .catch((error) => {
                    alert(error?.response?.data?.message || "Registration failed")
                })
                .finally(() => setIsLoading(false))
        } catch (err) {
            console.log(err)
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-white border-b border-outline-variant shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-lg">school</span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                        SIWES Management Portal
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/school/signin">
                        <button className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-all">
                            Back to Sign In
                        </button>
                    </Link>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center pt-16 px-4 mt-8">
                <div className="w-full max-w-[900px] grid md:grid-cols-2 bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-xl">
                    {/* Left Column Hero */}
                    <div className="relative hidden md:flex flex-col justify-end p-8 bg-primary text-white overflow-hidden">
                        <div className="relative z-10 space-y-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-2">
                                <span className="material-symbols-outlined text-3xl">verified_user</span>
                            </div>
                            <h2 className="text-2xl font-bold">Institution Signup</h2>
                            <p className="text-sm opacity-90">
                                Step 2 of 2: Upload institutional verification certificates and set up contact information.
                            </p>
                        </div>
                    </div>

                    {/* Right Column Form */}
                    <div className="p-8 flex flex-col justify-center overflow-y-auto max-h-[80vh]">
                        <div className="mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Step 2 of 2
                            </span>
                            <h1 className="text-xl font-extrabold text-primary">Upload Verification Docs</h1>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                                Enter verification code, address and upload documents.
                            </p>
                        </div>

                        <form className="space-y-3" onSubmit={signUp}>
                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Institution Accreditation Code / Certificate Number *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">verified</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                                        placeholder="Accreditation Certificate Code"
                                        type="text"
                                        required
                                        value={Certificte}
                                        onChange={(e) => setCertificte(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Contact Phone / Address *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-lg">call</span>
                                    <input
                                        className="w-full h-11 pl-10 pr-4 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none text-xs"
                                        placeholder="Contact Details"
                                        type="text"
                                        required
                                        value={Contact_Adress}
                                        onChange={(e) => setContact_Adress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Upload Profile Logo Image</label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => { e.preventDefault(); convertImg(e.dataTransfer.files[0]); }}
                                    className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-4 bg-surface flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 relative"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="profile-image-upload"
                                        className="hidden"
                                        onChange={(e) => convertImg(e.target.files[0])}
                                    />
                                    {Profile_Img ? (
                                        <div className="flex items-center gap-4 w-full justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={Profile_Img} alt="Preview" className="w-12 h-12 object-cover rounded-full border shadow-sm" />
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface">Ready for upload</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setProfile_Img(null);
                                                    profileUrl.current = null;
                                                }}
                                                className="px-2 py-1 bg-error/10 hover:bg-error/20 text-error text-xs font-bold rounded-lg flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="profile-image-upload" className="w-full h-full flex flex-col items-center justify-center py-2 cursor-pointer">
                                            <span className="material-symbols-outlined text-outline text-3xl mb-1">cloud_upload</span>
                                            <p className="text-xs font-semibold text-on-surface-variant">Drag & Drop or <span className="text-primary hover:underline">browse</span></p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-on-surface-variant mb-1">Upload CAC / Registration Certificate Image *</label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => { e.preventDefault(); convertCAC(e.dataTransfer.files[0]); }}
                                    className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-4 bg-surface flex flex-col items-center justify-center cursor-pointer transition-all space-y-2 relative"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="cac-image-upload"
                                        className="hidden"
                                        onChange={(e) => convertCAC(e.target.files[0])}
                                    />
                                    {CAC_Image ? (
                                        <div className="flex items-center gap-4 w-full justify-between">
                                            <div className="flex items-center gap-3">
                                                <img src={CAC_Image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border shadow-sm" />
                                                <div>
                                                    <p className="text-xs font-bold text-on-surface">Ready for upload</p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    setCAC_Image(null);
                                                    cacUrl.current = null;
                                                }}
                                                className="px-2 py-1 bg-error/10 hover:bg-error/20 text-error text-xs font-bold rounded-lg flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <label htmlFor="cac-image-upload" className="w-full h-full flex flex-col items-center justify-center py-2 cursor-pointer">
                                            <span className="material-symbols-outlined text-outline text-3xl mb-1">cloud_upload</span>
                                            <p className="text-xs font-semibold text-on-surface-variant">Drag & Drop or <span className="text-primary hover:underline">browse</span></p>
                                        </label>
                                    )}
                                </div>
                            </div>

                            <button
                                className="w-full h-11 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md mt-2 text-xs"
                                type="submit"
                                disabled={isLoading}
                            >
                                <span className="material-symbols-outlined text-sm">cloud_upload</span>
                                {isLoading ? "Registering Institution..." : "Register Institution"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SchoolSignup2