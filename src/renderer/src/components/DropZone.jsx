import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papelera from "../resources/PapeleraIcon.png";
import CargaArchivos from "../resources/ArchivosIcon.png";
import DroppedFile from "../resources/dropped_file_icon.png";
import Button from "./Button";
import Swal from 'sweetalert2';

export default function DropZone({ text_file, setFilePaths, filePaths = [] }) {
  // Estado para manejar la carga de archivos
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  // Función para manejar el drop de archivos
  const onDrop = useCallback((acceptedFiles) => {
    // Filtrar archivos que no sean .xls o .xlsx
    const validFiles = acceptedFiles.filter((file) =>
      file.name.endsWith('.xls') || file.name.endsWith('.xlsx')
    );

    if (validFiles.length) {
      const paths = validFiles.map((file) => file.path);
      setFilePaths(paths);  // Guarda los paths de archivos válidos
      setFileUploaded(true); // Activa el estado de archivo cargado
      setFileName(validFiles[0].name); // Guarda el nombre del archivo
      console.log(paths);   // Imprime los paths en consola
    } else {
      showErrorTypeFile();
    }
  }, [setFilePaths]);

  // Función para manejar la selección manual de archivos desde el explorador
  const handleFileDialog = async () => {
    const filePaths = await window.electronAPI.openFileDialog();
    if (filePaths.length) {
      setFilePaths(filePaths); // Guarda los paths completos obtenidos desde el explorador
      console.log(filePaths);   // Imprime los paths en consola
      setFileUploaded(true); // Activa el estado de archivo cargado
      setFileName(filePaths[0].split('\\').pop()); // Extrae el nombre del archivo del path
    } else {
      showErrorTypeFile();
    }
  };

  // Nueva función para eliminar el archivo
  const removeFile = () => {
    setFilePaths([]);
    setFileUploaded(false);
    setFileName('');
  };

  // Hook para dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.xls,.xlsx',
    noClick: true, // Desactiva el click en la zona de drop
    disabled: fileUploaded, // Deshabilita el dropzone cuando se ha cargado un archivo
  });

  // Estilos de la zona de drop
  const dropZoneStyle = {
    dropZoneContainer: {
      width: '47%',
      height: '200px',
      borderWidth: '2px',
      borderStyle: 'dashed',
      borderColor: '#aaa',
      borderRadius: '10px',
      display: 'flex',
      position: 'relative',
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
    dropText: {
      color: "black",
      fontWeight: "bold",
      fontSize: "15px",
      fontFamily: 'Arial, sans-serif',
    },
    subContainer: {
      alignItems: "center",
      flexDirection: "column",
      display: "flex",
    },
    iconSubida: {
      height: "50px",
      width: "50px",
      marginTop: "10px",
      marginBottom: "10px",
    },
    textChoose: {
      fontFamily: 'Arial, sans-serif',
      marginLeft: "5px",
      color: "#05549d",
      fontWeight: "bold",
      textDecoration: "underline",
      cursor: "pointer",
    },
    fileSourceText: {
      color: "#BABDCC",
      fontSize: "20px",
      fontWeight: "bold",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: 'Arial, sans-serif',
      marginRight: "8px",
    },
  };

  const showErrorTypeFile = () => {
    Swal.fire({
      title: 'Error!',
      text: 'Archivo no válido. Solo se permiten archivos .xls y .xlsx.',
      icon: 'error',
      confirmButtonText: 'Ok',
      didOpen: () => {
        const popup = document.querySelector('.swal2-popup');
        if (popup) {
          popup.style.fontFamily = 'Arial, sans-serif'; // Cambia la fuente
          popup.style.fontSize = '14px'; // Cambia el tamaño de la fuente
        }
      }
    });
  };

  return (
    <div style={dropZoneStyle.dropZoneContainer} {...getRootProps()}>
      <Button
        icon={Papelera}
        iconSize="25px"
        position="absolute"
        cursor="pointer"
        top="5px"
        left="90%"
        onClick={removeFile} // Agregado el evento onClick para eliminar el archivo
      />

      <input {...getInputProps()} />

      {isDragActive ? (
        <p style={dropZoneStyle.dropText}>Drop the files here...</p>
      ) : (
        <div style={dropZoneStyle.subContainer}>
          {/* Mostrar el nombre del archivo y el ícono correspondiente */}
          {fileUploaded ? (
            <>
              <img src={DroppedFile} style={dropZoneStyle.iconSubida} alt="Archivo Cargado" draggable='false'/>
              <p style={dropZoneStyle.dropText}>{fileName}</p>
            </>
          ) : (
            <>
              <span style={dropZoneStyle.fileSourceText}>{text_file}</span> 
              <img src={CargaArchivos} style={dropZoneStyle.iconSubida} alt="Upload" draggable='false'/>
              <p style={dropZoneStyle.dropText}>
                Drag and Drop File or 
                <span style={dropZoneStyle.textChoose} onClick={handleFileDialog}>Choose File</span>
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
