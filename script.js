// =========================
// ROOMS
// =========================

const rooms = [

    {
        id: "R101",
        name: "Garden Standard",
        type: "Standard",
        price: 1800,
        cap: 2,
        image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
        desc: "Cozy room with garden view, queen bed, Wi-Fi and private bathroom.",
        amenities: ["Queen Bed", "Wi-Fi", "Garden View"]
    },

    {
        id: "R102",
        name: "Cozy Standard",
        type: "Standard",
        price: 1600,
        cap: 2,
        image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        desc: "Practical and comfortable room for short stays and weekend trips.",
        amenities: ["Double Bed", "Wi-Fi", "TV"]
    },

    {
        id: "R202",
        name: "City Deluxe",
        type: "Deluxe",
        price: 2800,
        cap: 3,
        image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80",
        desc: "Spacious room with city view, king bed, desk and breakfast.",
        amenities: ["King Bed", "City View", "Breakfast"]
    },

    {
        id: "R203",
        name: "Family Deluxe",
        type: "Deluxe",
        price: 3200,
        cap: 4,
        image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80",
        desc: "Extra space for families with two beds and modern amenities.",
        amenities: ["2 Beds", "Wi-Fi", "Family Room"]
    },

    {
        id: "R301",
        name: "Premier Suite",
        type: "Suite",
        price: 4200,
        cap: 4,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
        desc: "Refined suite with separate lounge, king bed and balcony.",
        amenities: ["King Bed", "Balcony", "Lounge"]
    },

    {
        id: "R302",
        name: "Executive Suite",
        type: "Suite",
        price: 4800,
        cap: 4,
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
        desc: "Elegant suite with large living area, balcony and premium amenities.",
        amenities: ["King Bed", "Living Area", "Balcony"]
    }

];


// =========================
// VARIABLES
// =========================

const checkIn = document.getElementById("in");
const checkOut = document.getElementById("out");
const guests = document.getElementById("guests");

let selectedRoom = null;

let selectedCheckIn = "";
let selectedCheckOut = "";
let selectedGuests = 2;


// =========================
// DATE SETUP
// =========================

function getToday() {

    return new Date()
        .toISOString()
        .slice(0, 10);

}

checkIn.min = getToday();
checkOut.min = getToday();


checkIn.onchange = function () {

    checkOut.min =
        checkIn.value || getToday();

    checkOut.value = "";

};


// =========================
// BOOKING STORAGE
// =========================

function getBookings() {

    return JSON.parse(
        localStorage.getItem("stayeaseBookings") || "[]"
    );

}


function saveBookings(bookings) {

    localStorage.setItem(
        "stayeaseBookings",
        JSON.stringify(bookings)
    );

}


// =========================
// DATE FUNCTIONS
// =========================

function datesAreValid() {

    return (
        selectedCheckIn &&
        selectedCheckOut &&
        selectedCheckOut > selectedCheckIn
    );

}


function getNights(start, end) {

    const difference =
        new Date(end) -
        new Date(start);

    return Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    );

}


function formatDate(date) {

    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        "en-PH",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


function formatMoney(amount) {

    return "₱" +
        amount.toLocaleString("en-PH");

}


// =========================
// CONFLICT CHECK
// =========================

function hasConflict(
    start1,
    end1,
    start2,
    end2
) {

    return (
        start1 < end2 &&
        end1 > start2
    );

}


function roomIsAvailable(
    roomId,
    start,
    end
) {

    const bookings =
        getBookings();


    return !bookings.some(
        function (booking) {

            return (
                booking.roomId === roomId &&
                booking.status === "Confirmed" &&
                hasConflict(
                    start,
                    end,
                    booking.checkIn,
                    booking.checkOut
                )
            );

        }
    );

}


// =========================
// DISPLAY ROOMS
// =========================

function displayRooms() {

    let roomList =
        [...rooms];


    const selectedType =
        document.getElementById("type").value;


    const selectedSort =
        document.getElementById("sort").value;


    const guestCount =
        Number(guests.value);


    // Room type filter

    if (selectedType !== "all") {

        roomList =
            roomList.filter(
                function (room) {

                    return room.type === selectedType;

                }
            );

    }


    // Guest capacity

    roomList =
        roomList.filter(
            function (room) {

                return room.cap >= guestCount;

            }
        );


    // Sorting

    if (selectedSort === "low") {

        roomList.sort(
            function (a, b) {

                return a.price - b.price;

            }
        );

    }


    if (selectedSort === "high") {

        roomList.sort(
            function (a, b) {

                return b.price - a.price;

            }
        );

    }


    // Availability

    if (datesAreValid()) {

        roomList =
            roomList.filter(
                function (room) {

                    return roomIsAvailable(
                        room.id,
                        selectedCheckIn,
                        selectedCheckOut
                    );

                }
            );

    }


    const grid =
        document.getElementById("grid");


    if (roomList.length === 0) {

        grid.innerHTML = `

            <div>

                <h3>
                    No rooms found
                </h3>

                <p>
                    Try another room type,
                    guest count, or date range.
                </p>

            </div>

        `;

        return;

    }


    grid.innerHTML =
        roomList.map(
            function (room) {

                return `

                    <article class="card">

                        <div class="photo">

                            <img
                                src="${room.image}"
                                alt="${room.name}">

                            <span>
                                ${room.type}
                            </span>

                        </div>


                        <div class="cardbody">

                            <h3>
                                ${room.name}
                            </h3>


                            <p>
                                ${room.desc}
                            </p>


                            <div class="amenities">

                                ${room.amenities
                                    .map(
                                        function (item) {

                                            return `
                                                <span class="amenity">
                                                    ${item}
                                                </span>
                                            `;

                                        }
                                    )
                                    .join("")
                                }

                            </div>


                            <div class="meta">

                                <span class="price">

                                    ${formatMoney(room.price)}

                                    <small>
                                        / night
                                    </small>

                                </span>


                                <button
                                    class="btn dark"
                                    onclick="openBooking('${room.id}')">

                                    Book Room

                                </button>

                            </div>


                            <p class="capacity">

                                Up to
                                ${room.cap}
                                guests

                            </p>

                        </div>

                    </article>

                `;

            }
        ).join("");

}


// =========================
// SEARCH
// =========================

document.getElementById("search").onsubmit =
    function (event) {

        event.preventDefault();


        if (
            !checkIn.value ||
            !checkOut.value ||
            checkOut.value <= checkIn.value
        ) {

            showToast(
                "Please choose a valid date range."
            );

            return;

        }


        selectedCheckIn =
            checkIn.value;


        selectedCheckOut =
            checkOut.value;


        selectedGuests =
            Number(guests.value);


        displayRooms();


        document
            .getElementById("rooms")
            .scrollIntoView({
                behavior: "smooth"
            });


        showToast(
            "Availability updated."
        );

    };


// =========================
// FILTERS
// =========================

document.getElementById("type").onchange =
    displayRooms;


document.getElementById("sort").onchange =
    displayRooms;


// =========================
// OPEN BOOKING
// =========================

function openBooking(roomId) {

    if (!datesAreValid()) {

        showToast(
            "Choose check-in and check-out dates first."
        );

        return;

    }


    const room =
        rooms.find(
            function (room) {

                return room.id === roomId;

            }
        );


    if (
        !roomIsAvailable(
            roomId,
            selectedCheckIn,
            selectedCheckOut
        )
    ) {

        showToast(
            "That room is no longer available."
        );

        displayRooms();

        return;

    }


    selectedRoom =
        room;


    const totalNights =
        getNights(
            selectedCheckIn,
            selectedCheckOut
        );


    const totalPrice =
        room.price * totalNights;


    document.getElementById("modalBody")
        .innerHTML = `

        <small>
            RESERVE YOUR ROOM
        </small>


        <h2>
            ${room.name}
        </h2>


        <p class="sub">

            ${room.type}
            •
            Up to ${room.cap} guests

        </p>


        <div class="summary">

            Stay

            <strong>

                ${formatDate(selectedCheckIn)}
                –
                ${formatDate(selectedCheckOut)}

            </strong>

            <br>


            Guests

            <strong>
                ${selectedGuests}
            </strong>

            <br>


            Nights

            <strong>
                ${totalNights}
            </strong>

            <br>


            Total

            <strong>
                ${formatMoney(totalPrice)}
            </strong>

        </div>


        <form id="bookForm">


            <div class="form">


                <label>

                    Full Name

                    <input
                        name="name"
                        required
                        placeholder="Edison Villar">

                </label>


                <label>

                    Contact

                    <input
                        name="contact"
                        required
                        placeholder="09XXXXXXXXX">

                </label>


                <label class="full">

                    Email

                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com">

                </label>


            </div>


            <div class="payment">

                <strong>
                    Payment Method
                </strong>


                <label>

                    <input
                        type="radio"
                        name="payment"
                        value="Cash upon arrival"
                        checked>

                    Cash upon arrival

                </label>


                <label>

                    <input
                        type="radio"
                        name="payment"
                        value="GCash">

                    GCash

                </label>


                <label>

                    <input
                        type="radio"
                        name="payment"
                        value="Credit/Debit Card">

                    Credit/Debit Card

                </label>

            </div>


            <div class="policy">

                <strong>
                    Cancellation Policy
                </strong>

                <br>

                Free cancellation up to
                24 hours before check-in.
                This is a demonstration
                payment system only.

            </div>


            <button class="btn dark">

                Confirm Reservation

            </button>


        </form>

    `;


    document
        .getElementById("modal")
        .classList.remove("hidden");


    document.getElementById("bookForm")
        .onsubmit =
        confirmBooking;

}


// =========================
// CONFIRM BOOKING
// =========================

function confirmBooking(event) {

    event.preventDefault();


    const form =
        new FormData(event.target);


    const room =
        selectedRoom;


    // Check again before saving

    if (
        !roomIsAvailable(
            room.id,
            selectedCheckIn,
            selectedCheckOut
        )
    ) {

        closeModal();

        showToast(
            "Room was just booked by someone else."
        );

        displayRooms();

        return;

    }


    const totalNights =
        getNights(
            selectedCheckIn,
            selectedCheckOut
        );


    const booking = {

        id:
            "SE-" +
            Math.random()
                .toString(36)
                .slice(2, 8)
                .toUpperCase(),

        roomId:
            room.id,

        roomName:
            room.name,

        name:
            form.get("name"),

        contact:
            form.get("contact"),

        email:
            form.get("email"),

        checkIn:
            selectedCheckIn,

        checkOut:
            selectedCheckOut,

        guests:
            selectedGuests,

        payment:
            form.get("payment"),

        total:
            room.price * totalNights,

        status:
            "Confirmed"

    };


    const bookings =
        getBookings();


    bookings.unshift(
        booking
    );


    saveBookings(
        bookings
    );


    // Confirmation

    document.getElementById("modalBody")
        .innerHTML = `

        <small>
            RESERVATION CONFIRMED
        </small>


        <h2>
            You're all set.
        </h2>


        <p class="sub">

            Your StayEase reservation
            has been saved.

        </p>


        <div class="summary">

            Confirmation

            <strong>
                ${booking.id}
            </strong>

            <br>


            Room

            <strong>
                ${booking.roomName}
            </strong>

            <br>


            Check-in

            <strong>
                ${formatDate(booking.checkIn)}
            </strong>

            <br>


            Check-out

            <strong>
                ${formatDate(booking.checkOut)}
            </strong>

            <br>


            Guests

            <strong>
                ${booking.guests}
            </strong>

            <br>


            Payment

            <strong>
                ${booking.payment}
            </strong>

            <br>


            Total

            <strong>
                ${formatMoney(booking.total)}
            </strong>

        </div>


        <button
            class="btn dark"
            data-close>

            Done

        </button>

    `;


    displayBookings();

    displayRooms();

    showToast(
        "Booking confirmed!"
    );

}


// =========================
// DISPLAY BOOKINGS
// =========================

function displayBookings() {

    const bookings =
        getBookings();


    const bookingList =
        document.getElementById(
            "bookingList"
        );


    if (bookings.length === 0) {

        bookingList.innerHTML = `

            <div class="summary">

                No bookings yet.
                Your reservations
                will appear here.

            </div>

        `;

        return;

    }


    bookingList.innerHTML =
        bookings.map(
            function (booking) {

                const statusClass =
                    booking.status === "Cancelled"
                    ? "cancelled"
                    : "";


                return `

                    <div class="booking">


                        <div>

                            <span
                                class="status ${statusClass}">

                                ${booking.status}

                            </span>


                            <h3>
                                ${booking.roomName}
                            </h3>


                            <p>

                                ${booking.id}

                                •

                                ${booking.guests}
                                guest(s)

                            </p>

                        </div>


                        <div>

                            <p>

                                Check-in:

                                <b>
                                    ${formatDate(
                                        booking.checkIn
                                    )}
                                </b>

                            </p>


                            <p>

                                Check-out:

                                <b>
                                    ${formatDate(
                                        booking.checkOut
                                    )}
                                </b>

                            </p>


                            <p>

                                Payment:

                                <b>
                                    ${booking.payment}
                                </b>

                            </p>


                            <p>

                                Total:

                                <b>
                                    ${formatMoney(
                                        booking.total
                                    )}
                                </b>

                            </p>

                        </div>


                        <div>

                            ${
                                booking.status === "Confirmed"

                                ?

                                `
                                    <button
                                        class="btn danger"
                                        onclick="cancelBooking('${booking.id}')">

                                        Cancel

                                    </button>
                                `

                                :

                                ""

                            }

                        </div>


                    </div>

                `;

            }
        ).join("");

}


// =========================
// CANCEL BOOKING
// =========================

function cancelBooking(id) {

    if (
        !confirm(
            "Cancel this reservation?"
        )
    ) {

        return;

    }


    const bookings =
        getBookings();


    const booking =
        bookings.find(
            function (booking) {

                return booking.id === id;

            }
        );


    if (booking) {

        booking.status =
            "Cancelled";

    }


    saveBookings(
        bookings
    );


    displayBookings();

    displayRooms();


    showToast(
        "Reservation cancelled."
    );

}


// =========================
// CLOSE MODAL
// =========================

function closeModal() {

    document
        .getElementById("modal")
        .classList.add("hidden");

}


document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.dataset.close !== undefined
        ) {

            closeModal();

        }

    }
);


// =========================
// TOAST
// =========================

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


// =========================
// START WEBSITE
// =========================

displayRooms();

displayBookings();