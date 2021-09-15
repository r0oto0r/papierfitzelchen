import { DropzoneArea } from "material-ui-dropzone";
import { useAppDispatch } from "../hooks/general";
import { removeImageData, setImageData } from "../slices/imageSlice";

function ImageDrop(props: any): JSX.Element {
    const dispatch = useAppDispatch();
	const reader = new FileReader();

	const handleFileChange = (files: File[]) => {
		const imageFile = files[0];
		if(imageFile) {
			reader.onload = function(event){
				if(event.target) {
					dispatch(setImageData(event.target.result));
				}
			}
			reader.readAsDataURL(imageFile);  
		}
	};

	const handleFileDelete = (file: File) => {
		if(file) {
			dispatch(removeImageData())
		}
	};

	return <DropzoneArea
				acceptedFiles={['image/*']}
				filesLimit={1}
				dropzoneText={'images go here'}
				onChange={handleFileChange}
				onDelete={handleFileDelete}
			/>
}

export default ImageDrop;
