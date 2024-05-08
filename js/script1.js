emailjs.init('7YmH2OkwhbqNNhxpX');
const API_URL = 'https://restcountries.com/v3.1/';
const NEWS_API_KEY = 'd46bd19242064b01b1895581670b32b1';


async function fetchData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
        const data = await response.json();
        populateSelect(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function populateSelect(data) {
    var optgroup = document.getElementById('options');

    data.forEach(item => {
        var option = document.createElement('option');
        option.value = item.name.common;
        option.text = item.name.common;
        optgroup.appendChild(option);
    });
    console.log(data);
}

fetchData();

const selectElement = document.getElementById('selectElement');

selectElement.addEventListener('change', async function () {
    const country = selectElement.value;
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        const data = await response.json();
        const page = document.getElementById("page");
        page.style.removeProperty("display")
        presentData(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

//----------------------------------------------------------------------

async function presentData(data) {
    displayCountryInfo(data);
    displayMap(data);
    await fetchAndDisplayNews(data);
}


function displayCountryInfo(data) {
    displayImages(data[0].flags.png, data[0].coatOfArms.png);
    displayUNMembership(data[0].unMember, data[0].independent);
    displayPopulation(data[0].population);
    displayRegion(data[0].region);
    displayDay(data[0].startOfWeek);
    displayTimeZone(data[0].timezones[0]);
    displayCapital(data[0].capital);
}

function displayImages(flag, coat) {
    if(flag){
        const flagImg = document.getElementById('flag');
        flagImg.src = flag;
    }
    if(coat){
        const coatImg = document.getElementById('coat');
        coatImg.src = coat;
    }
}

function displayUNMembership(unMember, independent) {
    const checkIcon = document.getElementById('UNcheck');
    const timesIcon = document.getElementById('UNtimes');
    const dependCheck = document.getElementById('dependCheck');
    const dependTimes = document.getElementById('dependTimes');

    const unFlag = unMember;
    const dependFlag = independent;

    displayIcon(checkIcon, timesIcon, unFlag);
    displayIcon(dependCheck, dependTimes, dependFlag);
}

function displayIcon(positiveIcon, negativeIcon, condition) {
    if (condition) {
        negativeIcon.style.display = 'none';
    } else {
        positiveIcon.style.display = 'none';
    }
}

function displayPopulation(pop) {
    const population = document.getElementById('population');
    population.textContent = pop.toLocaleString();
}

function displayRegion(reg) {
    const region = document.getElementById('region');
    region.textContent = reg;
}

function displayDay(startOfWeek) {
    const day = document.getElementById('day');
    day.textContent = startOfWeek;
}

function displayTimeZone(timeZone) {
    const tZ = document.getElementById('timeZone');
    tZ.textContent = timeZone;
}

function displayCapital(theCapital) {
    const capital = document.getElementById('capital');
    capital.textContent = theCapital;
}

function displayMap(data) {
    const key = 'AIzaSyDCCfoXSZoK3UBns2vOgqjxikkomxkSp6k';
    const source = `https://www.google.com/maps/embed/v1/place?q=${data[0].name.common}&key=${key}`;

    const frame = document.getElementById('frame');
    frame.src = source;

    const map = document.getElementById('map');
    map.src = data[0].googleMaps;
}

async function fetchAndDisplayNews(data) {
    const countrySymbol = data[0].cca2;

    try{
        const newsResponse = await fetch(`https://api.worldnewsapi.com/search-news?api-key=${NEWS_API_KEY}&source-countries=${countrySymbol}`);
       const newsData = await newsResponse.json();
       populateNews(newsData);
      } catch(err) {
        console.log('Ohhhh nooo!');
        console.log(err);
      }
}


//-------------------------------------------------------------------------
const formSubmit = document.getElementById("myform");
formSubmit.addEventListener('submit', async function sendMail(e) {
    e.preventDefault();
    const firstName = document.getElementById("name").value;
    const myEmail = document.getElementById("email").value;
    const myMessage = document.getElementById("message").value;

    let params = {
        name: firstName,
        email: myEmail,
        message: myMessage
    };

    const serviceID = "service_wumwv1f";
    const templateID = "template_qpb758s";

    try {
        const res = await emailjs.send(serviceID, templateID, params);
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";
        console.log(res);
        alert("Your message sent successfully!!");
    } catch (err) {
        console.log("error")
    }
});

function populateNews(data) {
    console.log(data);
    try {
        if (data.news.length == 0){
            throw new error("noooo")
        } 
        const row = document.getElementById('newsRow');
        row.innerHTML = "";


        const defaultImage = "./notfound.jpg";

        data.news.forEach(
            Element => {
            
            const paragraph = Element.text.slice(0, 100);
            let myImage = Element.image;
        
            const htmlContent =
            `<div class="news-box" class="col-md-4">
            
                <div class="new-thumb">
                    <img class="myImage" src="${myImage}" alt="" onerror="this.onerror=null; this.src='${defaultImage}';">
                </div>

                <div class="new-txt">
                    <ul class="news-meta">
                        <li>${Element.publish_date}</li>
                    </ul>
                    <h6><a href="index.html#">${Element.title}</a></h6>
                    <p>${paragraph}</p>
                </div>

                <div class="news-box-f">
                    <img src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png" alt="">
                    ${Element.author}
                    <a href="${Element.url}"><i class="fas fa-arrow-right"></i></a>
                </div>
            
        </div>`

            row.innerHTML += htmlContent;
            }
        )
            
        


    } catch(erorr){
        console.log("error")
    }
}
