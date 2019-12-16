let book='';
const apiUrl = 'https://www.forverkliga.se/JavaScript/api/crud.php?';
let baseUrl = apiUrl;
let defaultKey = 2;
let keyArray=[];

console.log('1 Script started');
window.addEventListener('load', () => {
    console.log('2 Window load event');
    let keyMessage= document.querySelector('.keyMessage');
    keyMessage.innerText='';
    let loginContainer=document.querySelector('#loginContainer');
    let loginButton=document.querySelector('#loginButton');
    loginButton.addEventListener('click',event=>{
        password=loginContainer.value;
        console.log('password is:', password);
        console.log('array length', keyArray.length);
        
        for(let i=0; i<keyArray.length; i++){
            if(password===keyArray[i]){
                console.log('password correct!');
                keyMessage.innerHTML='Password is correct! It is ready to work here...';
                defaultKey=password;
                baseUrl=baseUrl = `${apiUrl}key=` + defaultKey;
                i=keyArray.length;
            }else{
                console.log('password incorrect!');
                keyMessage.innerHTML='Password is incorrect! Try again!...';
            }
            
           
        }
        
    })
	
	let keyButton = document.querySelector('#getKey');
	keyButton.addEventListener('click',  async event => {
		console.log(' Clicked on to get key');
        let keyUrl= `${apiUrl}requestKey`;
        
        keyMessage.innerHTML = '';
        for (let i=0; i<5; i++){
            try{
                const keyResponse = await fetch(keyUrl)
                const keyData = await keyResponse.json();
                
                console.log('key is: ', keyData.key);
                if (keyData.status==='success'){
                    console.log('Got key: ', keyData);
                    defaultKey = keyData.key;
                    keyArray.push(defaultKey);
                    console.log('keyArray is:', keyArray);
                    console.log('Key is: ' + defaultKey);
                    baseUrl = `${apiUrl}key=` + defaultKey;
                    let keyDiv = document.querySelector('.keyDiv');
                    keyMessage.innerHTML =`Your password is: ${defaultKey}`;
                    
                    keyMessage.innerHTML += 'Now it is ready to work here...';
                    i=6;
                }else if(keyData.status==='error'){
                    keyMessage.innerHTML+= '...'+ keyData.message;
                }
                else if ((keyData.status==='error')&&(i==4)){
                    
                    keyMessage.innerHTML += `It is not successful to get the key after ${i+1} try(ies)`;
                }
            }
            catch(error){
                keyMessage.innerHTML = 'Something went wrong. The error is: ' + error;
            }

        }
        
         
    });
    
    let addButton = document.querySelector('#add');
    addButton.addEventListener('click', async event=> {
        let myBooks = document.createElement('div');
        let addDiv = document.querySelector('.addDiv');
        let titleInput = document.querySelector('#title');
        let authortInput = document.querySelector('#author');
        let title = titleInput.value;
        let author = authortInput.value;
        let showAddResult = document.querySelector('#ShowAddResult');
        let errorMessages= document.querySelector('#errorDiv');
        errorMessages.innerHTML = '';
        showAddResult.innerHTML = '';
        
       
        let addUrl = `${baseUrl}&op=insert&title=${title}&author=${author}`;
        for(let i=0; i<5; i++){
            
            
            try {
                const response = await fetch(addUrl)
                const data = await response.json();
                if(data.status==='success'){
    
                    
                    console.log(`The latest request(the ${i+1}th one) to API was successful`);
                    
                    showAddResult.innerText += 'Book is added!...\n';
                    showAddResult.innerText += `The adding was successfull after ${i+1} time(s) try`;
                    
                   
                    i=6;
                }else if((data.status==='error')&&(i==4)){
                    errorMessages.innerText +='...'
                    errorMessages.innerText += data.message;
                    showAddResult.innerText+= `We had ${i+1} unsuccessful try(ies) to add the book`;
                    showAddResult.innerText += '\n Try the add botton again!';
                   
                    console.log(`The latest request(the ${i+1}th one) to API was unsuccessful`);
                }
                else if(data.status==='error'){
                    errorMessages.innerText +='...';
                    errorMessages.innerText += data.message;
                }
                
                console.log( data);
            }
            catch(error) {
                errorMessages.innerHTML += 'Something went wrong with adding! The error is: ' + error;
                console.log('Something went wrong! The error is: ', error);
            }
            
            
        
            
        
        }
        
    })
     
    let viewButton = document.querySelector('#viewButton');
    let viewDiv = document.querySelector('#showBooks');
    let viewResult = document.querySelector('#viewResult');

    let showErrors = document.querySelector('#showErrors');
    

    viewButton.addEventListener('click' , async event =>{
        showErrors.innerText='';
        console.log('view button clicked');
        let viewUrl = `${baseUrl}&op=select`;
        viewDiv.innerText = '';
        for (let i=0; i<5; i++){
           
          try {
            const response = await fetch(viewUrl)
            const info = await response.json();
            let addedBooks = info.data;
            if(info.status==='success'){
                viewResult.innerText = `The successful view result after ${i+1} try :`;
                if(addedBooks.length===0){
                    
                    viewResult.innerText += '\nBut there is no book in the library';
                }else{
                    viewResult.innerText += '\nBooks are viewed!';
                    
                }
                
                
                console.log(`The latest request(the ${i+1}th one) to API was successful`);
                
                
                
                addedBooks.forEach(b => {

                    let bookElement = createBookDOM(b);
                    
                    
                    
                    viewDiv.appendChild(bookElement);
                
                });
                console.log('added books :', addedBooks);
                
                
    
                i=6;
            }else if(info.status==='error'){
                showErrors.innerText +='...';
                showErrors.innerText += info.message;
            }
             else if((info.status==='error')&&(i==4)){
                 showErrors.innerText +='...';
                 showErrors.innerText += info.message;
                viewResult.innerText += `Vi had ${i+1} unccessful try ...\n`;
                viewResult.innerText += 'Click again the view button!';
                console.log(`The latest request(the ${i+1}th one) to API was unsuccessful`);
            }
            
             
            }
          
            catch(error) {
                viewResult.innerText ='Something went wrong with viewing! The error is:' + error;
          }
        }

    })
       
    function createBookDOM(receivedBook) {
       
        let messageContainer = document.createElement('div');
        messageContainer.innerHTML = 'Result messages here:';
        let modifyButton = document.createElement('button');
        let deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete!';
        modifyButton.innerText = 'Modify!';
        let modifyMessage = document.createElement('span');
        let deleteMessage = document.createElement('span');
        deleteMessage.innerHTML = '';
        modifyMessage.innerHTML = '';  
        let bookTitle = document.createElement('input');
        let bookAuthor = document.createElement('input');
        let bookContainer = document.createElement('div');
        bookContainer.className = 'bookContainer';
        modifyMessage.className = 'messageContainer';
        deleteMessage.className = 'messageContainer';
        bookTitle.value = receivedBook.title;
        bookAuthor.value = receivedBook.author;
        let bookT= bookTitle.value;
        let bookA= bookAuthor.value;
        let modifyErrors=document.querySelector('#modifyErrors');
        let deleteErrors=document.querySelector('#deleteErrors');
        
        bookContainer.appendChild(bookTitle);
        bookContainer.appendChild(bookAuthor);
        bookContainer.appendChild(modifyButton);
        bookContainer.appendChild(deleteButton);
       
        
        bookContainer.appendChild(messageContainer);
        modifyButton.addEventListener('click', async event=>{
            modifyErrors.innerHTML ='';
            console.log('the modify button is clicked!');
            let modifyUrl = `${baseUrl}&op=update&id=${receivedBook.id}&title=${bookTitle.value}&author=${bookAuthor.value}`;
            
            for (let j=0; j<5; j++){
               try{
                const modifyResponse = await fetch(modifyUrl);
                const modifyResult = await modifyResponse.json();
                
                if(modifyResult.status==='success'){
                    modifyMessage.innerHTML = `The modify result is successful after ${j+1} try(ies)`;
                    
                    console.log('modifyUrl:',modifyUrl);
                    console.log('The modify request was successful');
                    console.log('modify result is: ', modifyResult);
                    j=6;
                }
                    else if ((modifyResult.status==='error')&&(j==4)){
                    modifyErrors.innerText +='...';
                    modifyErrors.innerText +=modifyResult.message;
                    modifyMessage.innerHTML = `The modify result is unsuccessful after ${j+1} try(ies). Click again!`;
                    
                    console.log('click on modify button again');
                } else if(modifyResult.status==='error'){
                    modifyErrors.innerText +='...';
                    modifyErrors.innerText +=modifyResult.message;
                }
                
               } 
               catch (error){
                 modifyMessage.innerHTML = 'Something went wrong! The error is:' + error;
                 
               }
               messageContainer.appendChild(modifyMessage);
               
            }
            
        })

        deleteButton.addEventListener('click', async event=>{
        
            
           deleteErrors.innerHTML='';
            let deleteUrl = `${baseUrl}&op=delete&id=${receivedBook.id}`;
            modifyMessage.innerHTML = '';
            
            for (let j=0; j<5; j++){
                
                try{
                const deleteResponse = await fetch(deleteUrl);
                const deleteResult = await deleteResponse.json();
                
                if(deleteResult.status==='success'){
                    
                    deleteMessage.innerHTML = `The book: ${bookTitle.value} is deleted after ${j+1} try(ies).`;
                    
                   
                     bookContainer.removeChild(bookAuthor);
                     bookContainer.removeChild(bookTitle);
                     bookContainer.removeChild(deleteButton);
                     bookContainer.removeChild(modifyButton);
                    

                    console.log('The delete request was successful');
                    console.log('delete result is: ', deleteResult);
                    j=6;
                    
       
        
                    bookContainer.appendChild(messageContainer);
                }
                else if ((deleteResult.status==='error')&&(j==4)){
                    
                    deleteErrors.innerText +='...';
                    deleteErrors.innerText += deleteResult.message;

                    deleteMessage.innerHTML = `The delete result is unsuccessful after ${j+1} try(ies). Click again!`;
                    
                    console.log('click on delete button again');
                } else if(deleteResult.status==='error'){
                    deleteErrors.innerText +='...';
                    deleteErrors.innerText += deleteResult.message;

                }
                
               } 
               catch (error){
                 deleteMessage.innerHTML = 'Something went wrong! The error is:' + error;
                 
               }
               messageContainer.appendChild(deleteMessage);
            }
            
        })
        
        return bookContainer;
    }   
    
	
});

