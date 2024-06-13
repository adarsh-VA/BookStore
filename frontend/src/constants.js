const backendUrl = 'http://localhost:8000/api';
const backendImageUrl = 'http://localhost:8000/images'

const firebaseUrl = (imgName)=>{
    return `https://firebasestorage.googleapis.com/v0/b/bookstore-5e70b.appspot.com/o/${imgName}?alt=media`
}

module.exports = {
    backendUrl,
    backendImageUrl,
    firebaseUrl
}