import React from 'react';

import 'react-dropzone-uploader/dist/styles.css';
import {
  TextField,
  Typography,
  Link,
  LinearProgress as BaseLinearProgress,
  styled,
  IconButton,
} from '@astrosat/astrosat-ui';

import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Dropzone from 'react-dropzone-uploader';

import { ReactComponent as CsvIcon } from '../intro/csv.svg';

const UploadIcon = styled('div')(({ theme }) => ({
  position: 'relative',
  border: `dashed 1px ${theme.palette.grey[500]}`,
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: '50px',
  aspectRatio: '1.4',
  padding: theme.spacing(1),
  '& svg': {
    maxWidth: '31px',
    position: 'absolute',
    right: -5,
    bottom: -5,
  },
}));

const LinearProgress = styled(BaseLinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: '100vh',
  [`&.MuiLinearProgress-colorPrimary`]: {
    backgroundColor: theme.palette.grey[500],
  },
  [`& .MuiLinearProgress-bar`]: {
    borderRadius: '100vh',
    backgroundColor: theme.palette.info.main,
  },
}));

const FormWrapper = styled('form')(({ theme }) => ({
  display: 'grid',
  gridAutoFlow: 'row',
  rowGap: theme.spacing(2),
}));

const FileDrop = styled('div')(({ theme }) => ({
  display: 'grid',
  gridAutoFlow: 'row',
  justifyItems: 'center',
  backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23979797FF' stroke-width='4' stroke-dasharray='16' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
  borderRadius: '10px',
  padding: theme.spacing(2, 2, 3),
}));

/** @param {import('react-dropzone-uploader').ILayoutProps} props */
const DropzoneLayout = ({ dropzoneProps, input, previews }) => {
  const { className, ...rest } = dropzoneProps;
  return (
    <>
      <FileDrop {...rest}>{input}</FileDrop>
      {previews.length ? (
        previews
      ) : (
        // @ts-ignore
        <DropzonePreview meta={{}} />
      )}
    </>
  );
};

/** @param {import('react-dropzone-uploader').IInputProps} props */
const DropzoneInput = ({ getFilesFromEvent, onFiles, ...props }) => {
  const inputRef = React.useRef(null);

  const handleBrowseClick = () => {
    inputRef.current.click();
  };

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleInputChange = async event => {
    const files = await getFilesFromEvent(event);
    onFiles(files);
  };

  return (
    <>
      <input
        id="file-input"
        aria-labelledby="browse-link"
        type="file"
        ref={inputRef}
        onChange={handleInputChange}
        {...props}
      />
      <Typography variant="h1" component="div" gutterBottom>
        Drop the file here or{' '}
        <Link
          id="browse-link"
          aria-controls="file-input"
          // @ts-ignore
          component="button"
          type="button"
          variant="h1"
          onClick={handleBrowseClick}
        >
          Browse
        </Link>
      </Typography>
      <Typography variant="h4" component="p" paragraph>
        Only supported files will be processed.
      </Typography>
      <UploadIcon>
        <CsvIcon />
      </UploadIcon>
    </>
  );
};

/** @param {import('react-dropzone-uploader').IPreviewProps} props */
const DropzonePreview = ({ meta, fileWithMeta }) => {
  const { percent = 0, status, name } = meta;

  const handleButtonClick = () => {
    if (status === 'done') fileWithMeta.remove();
    if (status === 'preparing') fileWithMeta.cancel();
  };

  return (
    <>
      <LinearProgress
        variant="determinate"
        value={status === 'done' ? 100 : percent}
      />
      <UploadControls>
        <Typography variant="h3" component="p">
          {status === 'done'
            ? `Uploaded ${name}`
            : status?.includes('error')
            ? 'Invalid'
            : status === 'preparing'
            ? `Uploading ${name}`
            : 'No file available'}
        </Typography>
        <IconButton
          style={{
            color:
              status === 'done'
                ? 'lime'
                : status?.includes('error')
                ? 'red'
                : null,
          }}
          size="small"
          disabled={!status}
          onClick={handleButtonClick}
        >
          {status === 'done' ? <CheckCircleIcon /> : <CancelIcon />}
        </IconButton>
      </UploadControls>
    </>
  );
};

const UploadControls = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr min-content',
  alignItems: 'center',
});

export const Form = () => {
  /**
   *  @param {import('react-dropzone-uploader').IFileWithMeta} file
   *  @param {import('react-dropzone-uploader').StatusValue} status
   *  @param {import('react-dropzone-uploader').IFileWithMeta[]} allFiles
   */
  const handleChangeStatus = (file, status, allFiles) => {
    console.log({ file: file.meta.name, status, allFiles });
    if (allFiles.length > 1 && status !== 'removed') {
      allFiles.forEach(f => {
        if (f.meta.name !== file.meta.name) {
          f.remove();
        }
      });
    }
  };

  return (
    <FormWrapper>
      <Dropzone
        getUploadParams={({ meta }) => {
          console.log(meta);
          return { url: '' };
        }}
        onChangeStatus={handleChangeStatus}
        multiple={false}
        InputComponent={DropzoneInput}
        PreviewComponent={DropzonePreview}
        LayoutComponent={DropzoneLayout}
      />
      <TextField label="Name Your Data" required />
      <TextField label="Add a Description for Your Data" />
    </FormWrapper>
  );
};
