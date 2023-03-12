const bearer = '<---Enter Your Bearer Token Here--->';
window.onload = get();

// load the table of data
function loadTable(json){
    let table = document.getElementById("table");
    table.innerHTML = "";
    table.innerHTML += `
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>Status</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        `

    table.innerHTML += `<tbody>`;
    let x = 0;
    json.forEach(e => {
        let row = `
                    <tr>
                        <td>${e.id}</td>
                        <td>${e.name}</td>
                        <td>${e.email}</td>
                        <td>${e.gender}</td>
                        <td>${e.status}</td>
                        <td><button type="button" class="btn btn-outline-primary" onclick="deleteEntry(${e.id})">Delete</button></td>
                        <td><button type="button" class="btn btn-outline-primary" onclick="updateEntry(${x})">Update</button></td>
                    </tr>
                  `
        table.innerHTML += row;
        x++;
    });
    table.innerHTML += `</tbody>`
}

let jsonData;

// get method
async function get(){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearer}`);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,


      };
    
    try{

        await fetch("https://gorest.co.in/public/v2/users", requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result);
            loadTable(result);
            jsonData = result
        })
    }
    catch(error){
        console.log('error', error);
    }
}



// post method
async function post(){


    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearer}`);
    myHeaders.append("Content-Type", "application/json");

    // getting data from form
    let name = document.getElementById("name").value;
    let email = document.getElementById("eID").value;
    let gender = document.querySelector('input[name="radio"]:checked').value;
    let status =  document.querySelector('.checkb').checked;




    if(status){
        status = "active";
    }
    else{
        status = "inactive";
    }

    var raw = JSON.stringify({
        "name": name,
        "email": email,
        "gender": gender,
        "status": status
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    let loader = document.getElementById("spinner");
    document.querySelector('body').style.opacity = 0.3;
    loader.innerHTML = `
                        <i class="fas fa-spinner fa-spin" style="font-size:80px;width:80px;height:80px;line-height:80px;color:#000"></i>
                        `
    
    try{

        await fetch("https://gorest.co.in/public/v2/users", requestOptions)
        .then(response => response.json())
        .then(result => {
            document.getElementById("spinner").style.display = "none";
            document.querySelector('body').style.opacity = 1;
            get();
        })
    }
    catch(error){   
        console.log('error', error);
    }
}

// delete method
async function deleteEntry(entry){
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearer}`);
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
    };
    let loader = document.getElementById("spinner2");
    document.querySelector('body').style.opacity = 0.3;
    loader.innerHTML = `
                        <i class="fas fa-spinner fa-spin" style="font-size:80px;width:80px;height:80px;line-height:80px;color:#000"></i>
                        `
    

    try{

        await fetch(`https://gorest.co.in/public/v2/users/${entry}`, requestOptions)
        .then(response => response.text())
        .then(result => {
            document.getElementById("spinner2").style.display = "none";
            document.querySelector('body').style.opacity = 1;
            
            get();
        })
    }
    catch(error){
        console.log('error', error);
    } 
}

// update Method
function updateEntry(id){
    // console.log(id);
    var myModal = new bootstrap.Modal(document.getElementById('1exampleModal'), {
       keyboard: false
    })
    myModal.show();
    //
    // add data of that particular ID to modal
    let modalData = jsonData[id]
    let modalName = document.getElementById("1name");
    let modalEmail = document.getElementById("1eID");
    let modalgender = document.querySelector('input[name="1radio"]:checked').value;
    let modalMale = document.getElementById("1maleRadio");
    let modalFemale = document.getElementById("1femaleRadio");
    let modalstatus =  document.querySelector('.checkb1');

    modalName.value = modalData.name;
    modalEmail.value = modalData.email;
    modalstatus.checked = modalData.status==="active" ? true:false;

    if(modalMale.value===modalData.gender){
        modalMale.checked = true;
    }
    else if(modalFemale.value===modalData.gender){
        modalFemale.checked = true;
    }
    
    document.getElementById("update").addEventListener("click",async ()=>{

        let modalName = document.getElementById("1name");
        let modalEmail = document.getElementById("1eID");
        let modalgender = document.querySelector('input[name="1radio"]:checked').value;
        let modalstatus =  document.querySelector('.checkb1');
        let id = modalData.id;


        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${bearer}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "name": modalName.value,
        "email": modalEmail.value,
        "gender": modalgender,
        "status": modalstatus.checked===true?"active":"inactive"
        });

        var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        };

        let loader = document.getElementById("spinner3");
        document.querySelector('body').style.opacity = 0.3;
        loader.innerHTML = `
                            <i class="fas fa-spinner fa-spin" style="font-size:80px;width:80px;height:80px;line-height:80px;color:#000"></i>
                            `
        try{

            await fetch(`https://gorest.co.in/public/v2/users/${id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                myModal.hide();
                get();
                document.getElementById("spinner3").style.display = "none";
                document.querySelector('body').style.opacity = 1;
            })
        }
        catch(error){
            console.log('error', error);
        }
    })
}