export const  darkBlueBlack = '#000814';
export const brightBlue = '#005EFF';
export const softGray = '#F4F4F4';
export const red = '#FE0909';
export const green ='#00B221';

/* Font Size */
export const mediumSize = '1rem'; /* 16px */
export const smallSize = '0.875rem'; /* 14px */

/* Text field slot Props */

export const textFieldSlotPropsFilled = {
  input: {
    sx: {
      "&::before": {
        borderBottom: "0 !important",
      },
      "&::after": {
        borderBottom: "0 !important",
      },
      mt: 1.1,
      borderRadius: 1,
    },
  },
};

export const textFieldSlotProps = {
  root: {
    sx: {
      backgroundColor: softGray, // your desired background color
      borderRadius: 1,
      height: '50px',
      '& .MuiOutlinedInput-root': {
        height: '100%',
      },
      '& .MuiOutlinedInput-input': {
        height: '100%',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none', // removes the border
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
      mt: 1.1,
      
    },
  },
  input: {
    sx: {
      height: "50px",
    }
  }
}

export const textFieldSlotPropsReadOnly = {
  root: {
    sx: {
      backgroundColor: softGray, // your desired background color
      borderRadius: 1,
      height: '50px',
      '& .MuiOutlinedInput-root': {
        height: '100%',
      },
      '& .MuiOutlinedInput-input': {
        height: '100%',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none', // removes the border
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: 'none',
      },
      mt: 1.1,
      
    },
  },
  input: {
    sx: {
      height: "50px",
    },
    readOnly: true,
  }
}

// export const textFieldSlotProps = {
//   root: {
//     sx: {
//       // Remove the underline (filled variant underline)
//       '&::before': {
//         borderBottom: '0 !important',
//       },
//       '&::after': {
//         borderBottom: '0 !important',
//       },
//       borderRadius: 1,
//       backgroundColor: '#f0f0f0', // optional
//     },
//   },
//   input: {
//     sx: {
//       paddingTop: '14px',
//       paddingBottom: '14px',
//       display: 'flex',
//       alignItems: 'center',
//     },
//   },
// };

export const bodyFontSize = "14px";
export const selectStyle = {
  fontSize: bodyFontSize 
};
