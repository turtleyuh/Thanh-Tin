import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { detailsApplication, updateApplication } from '../actions/applicationActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { APPLICATION_UPDATE_RESET } from '../constants/applicationConstants';
import useScript from '../useScript';
import {CKEditor} from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor.js';
import {Helmet} from 'react-helmet';

export default function ApplicationEditScreen(props){
    const applicationId = props.match.params.id;
    const [title, setTitle] = useState('');
    const [entitle, setEntitle] = useState('');
    const [articletype, setArticletype] = useState('');
    const [enarticletype, setEnarticletype] = useState('');
    const [articleimage, setArticleimage] = useState('');
    const [content, setContent] = useState('');
    const [encontent, setEncontent] = useState('');
    const [articlecategory, setArticlecategory] = useState('');
    const [enarticlecategory, setEnarticlecategory] = useState('');

    const applicationDetails = useSelector((state) => state.applicationDetails);
    const { loading, error, application } = applicationDetails;

    const applicationUpdate = useSelector((state) => state.applicationUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = applicationUpdate;

    const dispatch = useDispatch();
    useEffect(() => {
        if(successUpdate){
            props.history.push('/applicationlist');
        }
        if (!application || application._id !== applicationId || successUpdate){
            dispatch({ type: APPLICATION_UPDATE_RESET});
            dispatch(detailsApplication(applicationId));
        } else {
            setTitle(application.title);
            setEntitle(application.entitle);
            setArticletype(application.articletype);
            setEnarticletype (application.enarticletype);
            setArticleimage(application.articleimage);
            setArticlecategory(application.articlecategory);
            setEnarticlecategory(application.enarticlecategory);
            setContent(application.content);
            setEncontent(application.encontent);
        }
    }, [application, dispatch, applicationId, successUpdate, props.history]);
    const submitHandler = (e) =>{
        e.preventDefault();
    // TODO: dispatch update product
        dispatch(
            updateApplication({
                _id: applicationId,
                title,
                entitle,
                articletype,
                enarticletype,
                articleimage,
                content,
                encontent,
                articlecategory,
                enarticlecategory,
            })
        );
    };
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const uploadFileHandler = async (e) =>{
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
            const {data} = await Axios.post('/api/uploads', bodyFormData,{
                headers:{
                    'Content-type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            setArticleimage(data);
            setLoadingUpload(false);
          } catch (error) {
            setErrorUpload(error.message);
            setLoadingUpload(false);
          }
    };
    const editorConfiguration = {
        toolbar: {
         items: [
           'code',
           'heading',
           '|',
           'alignment',
           'bold',
           'italic',
           'link',
           'bulletedList',
           'numberedList',
           '|',
           'highlight',
           'fontBackgroundColor',
           'fontColor',
           'MathType',
           'specialCharacters',
           'fontFamily',
           'fontSize',
           'ChemType',
           '|',
           'outdent',
           'indent',
           '|',
           'CKFinder',
           
           'blockQuote',
           'insertTable',
           'imageInsert',
           'mediaEmbed',
           'htmlEmbed',
           '|',
           'undo',
           'redo'
         ]
       },
       language: 'vi',
       image: {
         toolbar: [
           'imageTextAlternative',
           'imageStyle:inline',
           'imageStyle:block',
           'imageStyle:side',
           'linkImage'
         ]
       },
       table: {
         contentToolbar: [
           'tableColumn',
           'tableRow',
           'mergeTableCells'
         ]
       }
    };
   
    useScript("https://ckeditor.com/apps/ckfinder/3.4.5/ckfinder.js");
    return (
        <div>
            <form className="form edit-form" onSubmit={submitHandler}>
                <h1>Id b??i vi???t: {applicationId}</h1>
                {loadingUpdate && <LoadingBox></LoadingBox>}
                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox> 
                ) : (
                    <>
                    <Helmet>
                        <title>Edit: {application.title}</title>
                    </Helmet>
                    <div>
                        <label htmlFor="title">Ti??u ?????</label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Th??m ti??u ?????"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="entitle">Ti??u ????? (English)</label>
                        <input
                            id="entitle"
                            type="text"
                            placeholder="Enter english title"
                            value={entitle}
                            onChange={(e) => setEntitle(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="image">H??nh ???nh</label>
                        <input
                            id="image"
                            type="text"
                            placeholder="Enter image"
                            value={articleimage}
                            onChange={(e) => setArticleimage(e.target.value)}
                        ></input>
                    </div>
                    <div>
                    <label htmlFor="imageFile">Ch???n ???nh t??? m??y t??nh</label>
                    <input
                        type="file"
                        id="imageFile"
                        label="Choose Image"
                        onChange={uploadFileHandler}
                    ></input>
                    {loadingUpload && <LoadingBox></LoadingBox>}
                    {errorUpload && (
                        <MessageBox variant="danger">{errorUpload}</MessageBox>
                    )}
                    </div>
                    <div>
                        <label htmlFor="articletype">Lo???i</label> 
                        <select id="articletype" className="form-select" value={articletype} onChange={(e) => setArticletype(e.target.value)} aria-label="Default select example">
                        <option value="tin-tuc-va-su-kien">Tin t???c</option>
                        <option value="ung-dung">???ng d???ng</option>
                        <option value="du-an">D??? ??n</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="enarticletype">Lo???i</label> 
                        <select id="enarticletype" className="form-select" value={enarticletype} onChange={(e) => setEnarticletype(e.target.value)} aria-label="Default select example">
                        <option value="news">News</option>
                        <option value="application">Application</option>
                        <option value="project">Project</option>
        
                        </select>
                    </div>
                    <div>
                        <label htmlFor="articlecategory">Ng??nh ???ng d???ng</label> 
                        <input
                            id="articlecategory"
                            type="text"
                            placeholder="Th??m ti??u ?????"
                            value={articlecategory}
                            onChange={(e) => setArticlecategory(e.target.value)}
                        ></input>
                    </div>
                    <div>
                        <label htmlFor="enarticlecategory">Ng??nh ???ng d???ng (English)</label> 
                        <input
                            id="enarticlecategory"
                            type="text"
                            placeholder="Th??m ti??u ?????"
                            value={enarticlecategory}
                            onChange={(e) => setEnarticlecategory(e.target.value)}
                        ></input>
                    </div>
                    <div>
                    <label htmlFor="content">N???i dung</label>
                    <CKEditor 
                        className="content"
                        editor={Editor}
                        config={ editorConfiguration }
                        data={content}
                        onReady={editor =>{
                        }}
                        onChange={(e,editor)=>{
                        const data1 = editor.getData();
                        setContent(data1);
                        }}
                    />
                    </div>
                    <div>
                    <label htmlFor="encontent">N???i dung (English)</label>
                    <CKEditor 
                        className="encontent"
                        editor={Editor}
                        config={ editorConfiguration }
                        data={encontent}
                        onReady={editor =>{
                        }}
                        onChange={(e,editor)=>{
                        const data1 = editor.getData();
                        setEncontent(data1);
                        }}
                    />
                    </div>
                    <div>
                        
                        <button className="primary" type="submit">
                            C???p nh???t
                        </button>
                    </div>
                    </>
                )}
            </form>
        </div>
    );
}


