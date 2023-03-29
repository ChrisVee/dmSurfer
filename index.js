// Hide API key in the config file //
const key = config.SECRET_API_KEY

const textArea = document.querySelector(".input")
const apiResponse = document.getElementById("api-Response")
const subjectLine = document.getElementById("subjectLine")
const loadingDiv = document.getElementById("loading")
const characterCount = document.getElementById("character-count")

document.getElementById("processBtn").addEventListener("click", callChatGPT)

/* SHOW/HIDE LOADING SPINNER */
const allInputs = document.querySelectorAll('input')

//creates a tag for every input field and hides them while the spinner is loading//
function showSpinner() {
    allInputs.forEach(tag => tag.style.display = 'none')
    loadingDiv.style.display = 'block';
}

function hideSpinner() {
//creates a tag for every input field and hides them while the spinner is loading. Unset reverts the existing tag style display property//
    allInputs.forEach(tag => {
        tag.style.display = 'unset'
        tag.value = ''
    })
    loadingDiv.style.display = 'none';
}

/* API call*/
function callChatGPT() {
    const inputValue = document.querySelector(".input").value
    const inputRole = document.getElementById("role").value
    const inputJobDescription = document.getElementById("jobDescription").value

    // check if the input values are "falsy" AKA empty and alerts user.//
    //"Return" prevents rest of code from running.//

    if (!inputValue.trim() || !inputRole.trim() || !inputJobDescription.trim()) {
        alert("all fields must be filled")
        return 
    }

    const url = "https://api.openai.com/v1/completions" // change this if you change the model
    const requestData = {
        "model": "text-davinci-003", //change this for different OpenAI models
        "prompt": `Write a cold email to ${inputValue} a hiring manager looking to hire a ${inputRole}.  Do NOT exceed 300 characters, spaces count. Personalize the email by mentioning at least one of the responsibilities mentioned in the job description from ${inputJobDescription}. Think about your answer. Write casually like as if to a friend. Don't include the subject line or signature. Add a call to action at the end asking them to connect in the next day or two.`,
        "max_tokens": 256, // change this to 256 which is the max number of tokens
        "temperature": 0.7,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "logprobs": null,
        "stop": ["\\n"] //it wasn't working with the standard API doc implementation, but this
    }
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${key}` //change to my API key which is hidden in the config file
        },
        body: JSON.stringify(requestData)
    }

    // show loader
    showSpinner();

    fetch(url, option)
        .then((response) => response.json())
        .then((data) => {
            apiResponse.textContent = data.choices[0].text
        
        //hide loader //    
            hideSpinner()
           
            characterCount.textContent = apiResponse.textContent.length
        })

    //call subject line function //

    // getSubjectLine();
}


/* Subject Line API Call */

function getSubjectLine() {
    const url = "https://api.openai.com/v1/completions" // change this if you change the model
    const requestData = {
        "model": "text-davinci-003", //change this for different OpenAI models
        "prompt": `Use one of these subject lines. Don't mention the option number or phrase subject line: 
        1. "Why I think I'm the perfect fit for [position] at [company name]"
        2. "I'm excited to apply for [position] at [company name] - here's why"
        3. "As a [position], I believe I can make a significant contribution to [company name]"`,
        "max_tokens": 256, // change this to 256 which is the max number of tokens
        "temperature": 0.7,
        "top_p": 1,
        "n": 1,
        "stream": false,
        "logprobs": null,
        "stop": ["\\n"] //it wasn't working with the standard API doc implementation, but this
    }
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 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" //change to my API key
        },
        body: JSON.stringify(requestData)
    }

    fetch(url, option)
        .then((response) => response.json())
        .then((data) => {
            subjectLine.textContent = data.choices[0].text
    
    //hide loader //
            
        hideSpinner()
        })
}