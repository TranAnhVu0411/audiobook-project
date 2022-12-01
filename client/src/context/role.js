export const getRole = (currentUser) => {
    if (currentUser){
        if (currentUser.info.role === 'user'){
          return 'user'
        }else{
          return 'admin'
        }
      }else{
        return 'guest'
      }
};