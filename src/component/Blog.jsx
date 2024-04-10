import { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { formatTimestamp, getInitials } from '../utils';



function Blog() {
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [blogs, setBlogs] = useState([]);
    const [error, setError] = useState(null);
    const [blog, setBlog] = useState(null);
    const fileInputRef = useRef(null); // Ref to file input element

    const [blogFormData, setBlogFormData] = useState({
        blogTitle: '',
        blogImage: null,
        blogBody: '',
        blogId: ''
    });
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    useEffect(() => {
        refreshTable();
    }, []);

    const showToast = (message) => {
        setSnackbarMessage(message);

        setTimeout(() => {
            setSnackbarMessage('');
        }, 3000);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        window.location.reload()
    };
    const validateBlog = () => {
        const { blogTitle, blogBody } = blogFormData;

        if (blogTitle.trim().length < 20) {
            showToast('Blog title must contain at least 10 characters or more.');
            return false;
        }

        if (blogBody.trim().length < 100) {
            showToast('Blog body must contain at least 100 characters or more.');
            return false;
        }

        if (!blogFormData.blogTitle.trim()) {
            showToast('Please enter a blog title.');
            return false;
        }

        if (!blogFormData.blogImage) {
            showToast('Please select a blog image.');
            return false;
        }

        if (!blogFormData.blogBody.trim()) {
            showToast('Please enter a blog body.');
            return false;
        }

        return true;
    };


    const addBlog = async (event) => {
        event.preventDefault();

        if (!validateBlog()) return;

        setLoading(true);

        const formData = new FormData();
        formData.append('blogTitle', blogFormData.blogTitle);
        formData.append('blogImage', blogFormData.blogImage);
        formData.append('blogBody', blogFormData.blogBody);

        let url = `${import.meta.env.VITE_APP_BASE_URL_LOCAL}/blog`;
        let method = 'POST';

        if (blogFormData.blogId) {
            url += `/update/${blogFormData.blogId}`;
            method = 'PUT';
        } else {
            url += `/create`;
        }

        try {
            const response = await axios({
                method: method,
                url: url,
                data: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            showToast(response.data.message);
            refreshTable();
            setBlogFormData({
                blogTitle: '',
                blogImage: null,
                blogBody: '',
                blogId: ''
            });
            // Reset file input value
            fileInputRef.current.value = '';
        } catch (error) {
            showToast(error?.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    const deleteBlog = async (blogId) => {
        setLoading(true);

        try {
            const response = await axios.delete(`${import.meta.env.VITE_APP_BASE_URL_LOCAL}/blog/delete/${blogId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            showToast(response.data.message);
            refreshTable();
        } catch (error) {
            showToast(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    const updateBlog = async (blogId) => {
        setLoading(true);

        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL_LOCAL}/blog/byid/${blogId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBlogFormData({
                blogTitle: response.data.data.blogTitle,
                blogImage: response.data.data.blogImage,
                blogBody: response.data.data.blogBody,
                blogId: blogId
            });
        } catch (error) {
            showToast(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    const refreshTable = async () => {
        setLoading(true);

        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URL_LOCAL}/blog/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBlogs(response.data.data);
        } catch (error) {
            showToast(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setBlogFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setBlogFormData(prevState => ({
            ...prevState,
            blogImage: file
        }));
    };

    const ViewBlog = async (blogId) => {
        setLoading(true);
        await axios.get(`${import.meta.env.VITE_APP_BASE_URL_LOCAL}/blog/byid/${blogId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setLoading(false);
                setBlog(response.data.data);
            })
            .catch(error => {
                setLoading(false);
                setError(error.response.data.error);
            });
    };

    const closePopup = () => {
        setBlog(null);
    };

    const handleReset = () => {
        setBlogFormData({
            blogTitle: '',
            blogImage: null,
            blogBody: '',
            blogId: ''
        });
        fileInputRef.current.value = '';
    };

    const showImagePreview = (imageUrl) => {
        setImagePreviewUrl(imageUrl);
    };

    const closeImagePreview = () => {
        setImagePreviewUrl('');
    };

    return (
        <div>
            {snackbarMessage && (<div id="snackbar" className='show'>{snackbarMessage}</div>)}

            <nav className="sticky-nav flex justify-between items-center">
                <ul>
                    <li className="text-lg underline-move">KURADUSENGE</li>
                </ul>
                <ul>
                    <li className="text-sm underline-move" onClick={logout}>Logout</li>
                </ul>
            </nav>
            {imagePreviewUrl && (
                <div className="modal  flex items-center justify-center ">
                    <div className="modal-content">
                        <span className="close close-button" onClick={closeImagePreview}>&times;</span>
                        <img src={imagePreviewUrl} alt="Preview" />
                    </div>
                </div>
            )}
            <div className="flex flex-col">
                <h1 className="text-xl text-end pad w-fill">Admin</h1>
                <div id="About" className="flex flex-col gap-8 pad-y justify-center items-center w-screen">
                    <form className="flex gap-8 flex-col bg-white pad w-100 rounded form-fit" onSubmit={addBlog}>
                        <div className="form-group">
                            <input type="text" name="blogTitle" value={blogFormData.blogTitle} onChange={handleInputChange} placeholder="Blog title ....... ..... ......" required />
                            <input type="text" name="blogId" value={blogFormData.blogId} hidden />
                        </div>
                        <div className="form-group">
                            <input type="file" ref={fileInputRef} name="blogImage" onChange={handleFileChange} required />
                        </div>
                        <div className="form-group">
                            <textarea name="blogBody" value={blogFormData.blogBody} onChange={handleInputChange} placeholder="Blog Body ..... ...... ......." required></textarea>
                        </div>
                        <div className="form-group">
                            <button type="submit">Submit</button>
                            <button type="reset" onClick={handleReset}>Reset</button>
                        </div>
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table id="blogTable" className="table-auto w-full w-100">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Blog Title</th>
                                <th className="px-4 py-2">Image</th>
                                <th className="px-4 py-2">Blog Body</th>
                                <th className="px-4 py-2">Comments</th>
                                <th className="px-4 py-2">Likes</th>
                                <th className="px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs?.map(blog => (
                                <tr key={blog._id}>
                                    <td className="px-4 py-2">{blog.blogTitle.slice(0, 6) + "..."}</td>
                                    <td className="px-4 py-2">
                                        <img src={blog.blogImage} alt="Uploaded Image" className="max-w-xs max-h-xs cursor-pointer" onClick={() => showImagePreview(blog.blogImage)} />
                                    </td>
                                    <td className="px-4 py-2">{blog.blogBody.slice(0, 6) + "..."}</td>
                                    <td className="px-4 py-2">{blog.comments.length}</td>
                                    <td className="px-4 py-2">{blog.likes}</td>
                                    <td className="px-4 py-2">
                                        <button onClick={() => deleteBlog(blog._id)} className="bg-red  text-white px-2 py-1 rounded m-2">Delete</button>
                                        <button onClick={() => updateBlog(blog._id)} className="bg-primary text-white px-2 py-1 rounded m-2">Update</button>
                                        <button onClick={() => ViewBlog(blog._id, token)} className="bg-primary text-white px-2 py-1 rounded m-2">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="loader-container">
                        <span className="loader"></span>
                    </div>
                )}
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {blog && (
                <div className="popup">
                    <div className="popup-content bg-black text-white pad rounded flex items-center flex-col">
                        <span className="close close-button" onClick={closePopup}>&times;</span>
                        <div className='flex justify-between '>
                            <h1 className="text-lg text-end pad">{blog.blogTitle}</h1>
                            <h1 className="text-lg text-end pad">Likes: {blog.likes}</h1>
                        </div>
                        <div className='w-grid '>
                            <div className="gap-8 rounded w-full pad flex items- flex-col justify-between">
                                <img src={blog.blogImage} alt="Blog Image" className='w-grid' />
                                <p>{blog.blogBody}</p>
                            </div>
                            <div className="">
                                <h2>Comments</h2>
                                {blog.comments.map((comment, index) => (
                                    <div className="comment-wrapper flex items-center gap-8 text-white" key={index}>
                                        <div className="profile-text text-center flex items-center justify-center rounded" title={comment.name}>{getInitials(comment.name)}</div>
                                        <div className="comment-content flex flex-col">
                                            <span className="text-xs">{comment.name}</span>
                                            <p>{comment.comment}</p>
                                            <small className="text-xs">{formatTimestamp(comment.createdAt)}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Blog;
