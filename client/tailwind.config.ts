module.exports = {
  theme: {
    extend: {
      keyframes: {
        "spinner-leaf-fade": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "spinner-leaf-fade": "spinner-leaf-fade 800ms linear infinite",
      },
    },
  },
};
