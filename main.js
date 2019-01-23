// Global variables
const table_pagination = document.getElementById("table_pagination");
const table_body = document.getElementById("table_body");
const inputs_checkbox = document.getElementsByTagName('input');
const sorting_images = document.getElementsByClassName('sorting');
const sort_button = document.getElementsByClassName('sort_active');

const pagination_buttons = document.getElementsByClassName('pagination-button');
const authenicated_inputs = document.getElementsByClassName('input-container');
const client_emial = document.getElementById('email');
const authenication_code = document.getElementById('authenication-code');
const rewrote_authenication_code = document.getElementById('rewrote-authenication-code');
var filtered_data = [];


//

$('.carousel').carousel({
  interval: 2000
})

function validateEmail(email) {
  var re =  /\S+@\S+\.\S+/;
  return re.test(email);
}

function change_sorting_Class() {

  for(let i = 0; i < sorting_images.length; i++) {
    sorting_images[i].classList.remove('sort_active')
  }

  this.classList.add('sort_active');
  refresh();
}

for(let i = 0; i < sorting_images.length; i++) {
  sorting_images[i].addEventListener('click', change_sorting_Class)
}

function setRequiredInput() {
  let counter = 0;

  for(let i = 0; i < authenicated_inputs.length; i++) {

    if(authenicated_inputs[i].children[0].value === '') {
      authenicated_inputs[i].classList.add('required');
      counter++
    } else {
      authenicated_inputs[i].classList.remove('required');
    }

  }

  if(counter > 0) {
    return false
  }

  return true;
}

for(let i = 0; i < authenicated_inputs.length; i++) {
  authenicated_inputs[i].addEventListener('click', setRequiredInput)
}

client_emial.addEventListener('click', () => {
  const email = client_emial.value
  const email_response = validateEmail(email)
  console.log(email_response)
  if (!email_response) {
        client_emial.parentElement.classList.add('required');
        client_emial.setAttribute('required', 'false');
      } else {
    client_emial.parentElement.classList.remove('required');
    client_emial.setAttribute('required', 'true');
  }
})

function sendForm() {
  const is_required = setRequiredInput();
  const email = client_emial.value
  const email_response = validateEmail(email)
  const value_of_code = authenication_code.value
  const value_of_written_code = rewrote_authenication_code.value.toUpperCase()

  if(is_required && email_response && value_of_code === value_of_written_code) {
    alert('Your message has been send')
  }
}


function switching(option) {
  const options = option.parentElement.parentElement.getElementsByClassName("values")
  const image = option.getElementsByClassName('arrow-image')
  let class_names = options[0].className

   if (class_names === "values") {
     options[0].className = "values hide"
     image[0].src = "file:///home/bartlomiej/ania_workspace/project_for_ultimate_system/assets/rozwin.png"
   } else if (class_names === "values hide") {
     options[0].className = "values"
     image[0].src = "file:///home/bartlomiej/ania_workspace/project_for_ultimate_system/assets/zwin.png"
   }
}


function generateButton(number_of_pages, page_number) {

  table_pagination.innerHTML = ''

  for(let i = 0; i < number_of_pages; i++) {
    if(i === (page_number)) {
      table_pagination.insertAdjacentHTML("beforeend",
        `<button class="pagination-button clicked" value="${i}">${i+1}</button>`)
    } else {
      table_pagination.insertAdjacentHTML("beforeend",
      `<button class="pagination-button" value="${i}">${i+1}</button>`)
    }
  }
}


function generateTable(data, page_number) {

  const rows_start = page_number*10
  const rows_end = rows_start + 10

  table_body.innerHTML = ''

  for(let i = rows_start; i < rows_end; i++) {

    try {
      table_body.insertAdjacentHTML("beforeend",
      `<tr>
              <td>${data[i]['numer']}</td>
              <td>${data[i]['kondygnacja']}</td>
              <td>${data[i]['pow_uzytkowa']}</td>
              <td>${data[i]['typ_pow_dodatkowej']} ${data[i]['pow_dodatkowa']}</td>
              <td>${data[i]['cena']}</td>
              <td>pobierz</td>
              <td>${data[i]['status']}</td>
            </tr>`
      )
    }
    catch (err) {
      break;
    }

  }
}


function compareValues(key , order) {
  return function(a, b) {

    let compare = 0;

    if (a[key] < b[key]){
      compare = 1
    } else if(a[key] > b[key]) {
        compare = -1
      }

    if(order === 'desc') {
      return compare * -1
    }

    return compare
  };
}

function sortData(data) {
  let key = ''
  let order = ''
  if(sort_button.length > 0) {
    console.log(sort_button)
    key = sort_button[0].getAttribute('column')
    order = sort_button[0].getAttribute('order')
  }


  return data.sort(compareValues(key, order))
}

function getInputsData() {
  let checked_inputs = [];

  for(let i = 0; i < inputs_checkbox.length; i++) {
    if(inputs_checkbox[i].checked) {
      checked_inputs.push([inputs_checkbox[i].getAttribute('column'), inputs_checkbox[i]['value']])
    }
  }

  return checked_inputs;
}

function filterData(data) {
  const checked_inputs = getInputsData();
  let filtered_data = data;
  for(let i = 0; i < checked_inputs.length; i++) {
    filtered_data = filtered_data.filter(item => {
      return item[checked_inputs[i][0]] == checked_inputs[i][1]
    })
  }
  return filtered_data
}

function change_pagination_Class() {

  for(let i = 0; i < pagination_buttons.length; i++) {
    pagination_buttons[i].classList.remove('clicked')
  }

  this.classList.add('clicked');

  refresh()
}

function refresh(filtering=false) {

  const active_button = document.getElementsByClassName('clicked');

  filtering ? filtered_data = filterData(data) : filtered_data = filtered_data;

  let sorted_data = sortData(filtered_data);

  let page_number;
  active_button.length > 0 ? (page_number = Number(active_button[0].value)) : page_number = 0;

  const number_of_rows = sorted_data.length;
  const number_of_pages = number_of_rows / 10;

  generateTable(sorted_data, page_number);

  generateButton(number_of_pages, page_number);

  for(let i = 0; i < pagination_buttons.length; i++) {
  pagination_buttons[i].addEventListener('click', change_pagination_Class)
}

}

refresh(filtering = true)



