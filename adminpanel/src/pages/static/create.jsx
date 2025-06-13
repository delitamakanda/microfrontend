import { useNavigate } from "react-router-dom";
import axiosInstance from "storefrontApp/api";
import {useState, useEffect, useRef} from "react";
import {Controller, useForm} from "react-hook-form";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import {Card} from "primereact/card";
import {Button} from "primereact/button";

export const FlatPageCreate = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const quillRef = useRef(null);
    const editorRef = useRef(null);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            content: "",
            url: "",
            sites: [1],
        }
    });

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'font': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                        ['link', 'image', 'video']
                    ]
                },
                theme: 'snow'
            });
            quillRef.current.on('text-change', () => {
                setValue("content", quillRef.current.root.innerHTML);
            });
        }

        return () => {
            if (!quillRef.current) {
                quillRef.current.off('text-change');
            }
        }
    }, [setValue])

    const goBack = () => {
        navigate(-1);
    }

    const onSubmit = async (data) => {
        setLoading(true);

        const response = await axiosInstance.post('store/flatpage/', JSON.stringify({
            title: data.title,
            content: data.content,
            url: data.url,
            sites: data.sites
            })
        );
        if (response.status === 201) {
            setLoading(false);
            goBack();
        }
    }
    return (
        <Card className="shadow-1" title={
            <div className="flex align-items-center">
                <Button onClick={goBack} icon="pi pi-arrow-left" className="mr-1" text="Back" />
                <h3>Create New Flat Page</h3>
            </div>
        }>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-fluid">
                    <Controller name="title" control={control} rules={{ required: true }} render={({ field }) => (
                        <div className={errors.title? "p-field p-invalid" : "p-field"}>
                            <label htmlFor={field.name}>Title</label>
                            <input type="text" {...field} />
                            {errors.title && <span className="p-error">{errors.title.message}</span>}
                        </div>
                        )}
                    />
                    <Controller name="content" control={control} rules={{ required: true }} render={({ field }) => (
                        <div className={errors.content? "p-field p-invalid" : "p-field"}>
                            <label htmlFor={field.name}>Content</label>
                            <div style={{height: "300px", overflow: "auto"}} ref={editorRef} />
                            {errors.content && <span className="p-error">{errors.content.message}</span>}
                        </div>
                        )}
                    />
                    <Controller name="url" control={control} rules={{ required: true }} render={({ field }) => (
                        <div className={errors.url? "p-field p-invalid" : "p-field"}>
                            <label htmlFor={field.name}>URL</label>
                            <input type="text" {...field} />
                            {errors.url && <span className="p-error">{errors.url.message}</span>}
                        </div>
                        )}
                    />
                    <div className="p-mt-3">
                        <Button type="submit" label="Save" className="p-button-success" disabled={loading} />
                    </div>
                </div>
            </form>
        </Card>
    )
}