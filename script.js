document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================
       ELEMENT
    ========================================== */

    const settingsBtn =
        document.getElementById("settingsBtn");

    const downloadTableBtn =
        document.getElementById("downloadTableBtn");

    const editPanel =
        document.getElementById("editPanel");

    const closeBtn =
        document.getElementById("closeBtn");

    const rowSelect =
        document.getElementById("rowSelect");

    const numberInput =
        document.getElementById("numberInput");

    const jackpotInput =
        document.getElementById("jackpotInput");

    const saveBtn =
        document.getElementById("saveBtn");

    const rows =
        document.querySelectorAll("#jackpotBody tr");


    /* ==========================================
       CEK ELEMENT
    ========================================== */

    if (
        !settingsBtn ||
        !downloadTableBtn ||
        !editPanel ||
        !closeBtn ||
        !rowSelect ||
        !numberInput ||
        !jackpotInput ||
        !saveBtn
    ) {

        console.error(
            "Element HTML tidak ditemukan."
        );

        return;
    }


    /* ==========================================
       LOCAL STORAGE
    ========================================== */

    let savedData = {};

    try {

        savedData =
            JSON.parse(
                localStorage.getItem("jackpotData")
            ) || {};

    } catch (error) {

        savedData = {};

    }


    /* ==========================================
       FORMAT JACKPOT
    ========================================== */

    function formatJackpot(value) {

        const numbers =
            String(value)
                .replace(/\D/g, "");

        if (!numbers) {
            return "";
        }

        return (
            Number(numbers)
                .toLocaleString("id-ID")
            + ".00"
        );
    }


    /* ==========================================
       FORMAT NOMOR
    ========================================== */

    function formatPhoneNumber(value) {

        let number =
            String(value)
                .replace(/\D/g, "");


        if (
            number.startsWith("62") &&
            number.length >= 3
        ) {

            number =
                number.substring(2);

        }


        if (
            number.startsWith("0")
        ) {

            number =
                number.substring(1);

        }


        number =
            number.substring(0, 11);


        if (
            number.length <= 3
        ) {

            return number;

        }


        if (
            number.length <= 7
        ) {

            return (
                number.substring(0, 3)
                + "-"
                + number.substring(3)
            );

        }


        return (
            number.substring(0, 3)
            + "-"
            + number.substring(3, 7)
            + "-"
            + number.substring(7)
        );

    }


    /* ==========================================
       BUKA PANEL EDIT
    ========================================== */

    settingsBtn.addEventListener(
        "click",
        function () {

            loadSelectedData();

            editPanel.classList.add("show");


            setTimeout(
                function () {

                    numberInput.focus();


                    const length =
                        numberInput.value.length;


                    try {

                        numberInput.setSelectionRange(
                            length,
                            length
                        );

                    } catch (error) {}

                },
                100
            );

        }
    );


    /* ==========================================
       TUTUP PANEL EDIT
    ========================================== */

    closeBtn.addEventListener(
        "click",
        function () {

            editPanel.classList.remove(
                "show"
            );

        }
    );


    /* ==========================================
       KLIK LUAR PANEL
    ========================================== */

    editPanel.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                editPanel
            ) {

                editPanel.classList.remove(
                    "show"
                );

            }

        }
    );


    /* ==========================================
       PILIH DATA
    ========================================== */

    rowSelect.addEventListener(
        "change",
        function () {

            loadSelectedData();

        }
    );


    /* ==========================================
       LOAD DATA TERPILIH
    ========================================== */

    function loadSelectedData() {

        const index =
            Number(rowSelect.value);


        const row =
            rows[index];


        if (!row) {
            return;
        }


        const numberCell =
            row.querySelector(
                ".number-data"
            );


        const jackpotCell =
            row.querySelector(
                ".jackpot-data"
            );


        if (!numberCell || !jackpotCell) {
            return;
        }


        numberInput.value =
            numberCell.textContent.trim();


        let jackpotValue =
            jackpotCell.textContent.trim();


        if (
            jackpotValue &&
            jackpotValue !== "//"
        ) {

            jackpotValue =
                jackpotValue
                    .replace(/\./g, "")
                    .replace(/00$/, "");

        }


        jackpotInput.value =
            jackpotValue;

    }


    /* ==========================================
       INPUT NOMOR
       AUTO FORMAT + CURSOR
    ========================================== */

    numberInput.addEventListener(
        "input",
        function () {

            const oldValue =
                this.value;


            const cursorBefore =
                this.selectionStart || 0;


            const digitsBeforeCursor =
                oldValue
                    .slice(0, cursorBefore)
                    .replace(/\D/g, "")
                    .length;


            const formatted =
                formatPhoneNumber(
                    oldValue
                );


            this.value =
                formatted;


            const totalDigits =
                formatted
                    .replace(/\D/g, "")
                    .length;


            let newCursor = 0;

            let digitCount = 0;


            if (
                digitsBeforeCursor === 0
            ) {

                newCursor = 0;

            } else {

                for (
                    let i = 0;
                    i < formatted.length;
                    i++
                ) {

                    if (
                        /\d/.test(
                            formatted[i]
                        )
                    ) {

                        digitCount++;

                    }


                    newCursor++;


                    if (
                        digitCount >=
                        digitsBeforeCursor
                    ) {

                        break;

                    }

                }

            }


            if (
                digitsBeforeCursor >=
                totalDigits
            ) {

                newCursor =
                    formatted.length;

            }


            try {

                this.setSelectionRange(
                    newCursor,
                    newCursor
                );

            } catch (error) {}

        }
    );


    /* ==========================================
       INPUT JACKPOT
    ========================================== */

    jackpotInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value.replace(
                    /\D/g,
                    ""
                );

        }
    );


    /* ==========================================
       SIMPAN PERUBAHAN
    ========================================== */

    saveBtn.addEventListener(
        "click",
        function () {

            const index =
                Number(rowSelect.value);


            const row =
                rows[index];


            if (!row) {
                return;
            }


            const numberCell =
                row.querySelector(
                    ".number-data"
                );


            const jackpotCell =
                row.querySelector(
                    ".jackpot-data"
                );


            if (
                !numberCell ||
                !jackpotCell
            ) {

                return;

            }


            /* ==============================
               NOMOR
            ============================== */

            const newNumber =
                formatPhoneNumber(
                    numberInput.value
                );


            numberInput.value =
                newNumber;


            numberCell.textContent =
                newNumber;


            /* ==============================
               JACKPOT
            ============================== */

            const rawJackpot =
                jackpotInput.value
                    .replace(
                        /\D/g,
                        ""
                    );


            let finalJackpot =
                "//";


            if (rawJackpot) {

                finalJackpot =
                    formatJackpot(
                        rawJackpot
                    );

            }


            jackpotCell.textContent =
                finalJackpot;


            /* ==============================
               SIMPAN LOCAL STORAGE
            ============================== */

            savedData[index] = {

                number:
                    newNumber,

                jackpot:
                    finalJackpot

            };


            localStorage.setItem(
                "jackpotData",
                JSON.stringify(
                    savedData
                )
            );


            /* ==============================
               TUTUP PANEL
            ============================== */

            editPanel.classList.remove(
                "show"
            );


            /* ==============================
               ALERT
            ============================== */

            showSuccessAlert();

        }
    );


    /* ==========================================
       DOWNLOAD HEADER + TABEL
    ========================================== */

    downloadTableBtn.addEventListener(
        "click",
        async function () {

            const page =
                document.getElementById(
                    "page"
                );


            const settingsArea =
                document.querySelector(
                    ".settings-area"
                );


            if (!page) {

                alert(
                    "Area halaman tidak ditemukan."
                );

                return;

            }


            if (
                typeof html2canvas ===
                "undefined"
            ) {

                alert(
                    "Library html2canvas belum siap. Coba lagi."
                );

                return;

            }


            const originalText =
                downloadTableBtn.innerHTML;


            downloadTableBtn.innerHTML =
                "⏳ <span>MEMBUAT GAMBAR...</span>";


            downloadTableBtn.disabled =
                true;


            try {

                /*
                =====================================
                SEMBUNYIKAN TOMBOL SAAT SCREENSHOT
                =====================================
                */

                if (settingsArea) {

                    settingsArea.style.display =
                        "none";

                }


                /*
                =====================================
                HTML2CANVAS
                =====================================

                Kita memakai onclone.

                Halaman asli TIDAK diubah.

                Hanya halaman CLONE yang dipakai
                untuk membuat gambar.

                Background header diubah menjadi
                <img> agar pasti tertangkap.
                */

                const canvas =
                    await html2canvas(
                        page,
                        {

                            backgroundColor:
                                "#ffffff",

                            scale: 2,

                            useCORS:
                                true,

                            allowTaint:
                                false,

                            logging:
                                false,

                            imageTimeout:
                                30000,

                            scrollX:
                                0,

                            scrollY:
                                0,

                            width:
                                page.scrollWidth,

                            height:
                                page.scrollHeight,


                            /*
                            =================================
                            ON CLONE
                            =================================
                            */

                            onclone:
                                function (
                                    clonedDocument
                                ) {

                                    const clonedPage =
                                        clonedDocument.getElementById(
                                            "page"
                                        );


                                    if (!clonedPage) {
                                        return;
                                    }


                                    /*
                                    ---------------------------------
                                    AMBIL HEADER CLONE
                                    ---------------------------------
                                    */

                                    const clonedHeader =
                                        clonedPage.querySelector(
                                            ".header-reference"
                                        );


                                    if (
                                        !clonedHeader
                                    ) {

                                        return;

                                    }


                                    /*
                                    ---------------------------------
                                    URL GAMBAR HEADER
                                    ---------------------------------
                                    */

                                    const imageUrl =
                                        new URL(
                                            "assets/img/header-reference.jpg",
                                            document.baseURI
                                        ).href;


                                    /*
                                    ---------------------------------
                                    HAPUS BACKGROUND CLONE
                                    ---------------------------------
                                    */

                                    clonedHeader.style.backgroundImage =
                                        "none";


                                    /*
                                    ---------------------------------
                                    PASTIKAN HEADER RELATIVE
                                    ---------------------------------
                                    */

                                    clonedHeader.style.position =
                                        "relative";


                                    clonedHeader.style.overflow =
                                        "hidden";


                                    /*
                                    ---------------------------------
                                    BUAT IMG
                                    ---------------------------------
                                    */

                                    const headerImage =
                                        clonedDocument.createElement(
                                            "img"
                                        );


                                    headerImage.src =
                                        imageUrl;


                                    headerImage.crossOrigin =
                                        "anonymous";


                                    headerImage.alt =
                                        "";


                                    /*
                                    ---------------------------------
                                    STYLE IMG
                                    ---------------------------------
                                    */

                                    headerImage.style.position =
                                        "absolute";


                                    headerImage.style.left =
                                        "0";


                                    headerImage.style.top =
                                        "0";


                                    headerImage.style.width =
                                        "100%";


                                    headerImage.style.height =
                                        "100%";


                                    headerImage.style.objectFit =
                                        "fill";


                                    headerImage.style.objectPosition =
                                        "center";


                                    headerImage.style.display =
                                        "block";


                                    headerImage.style.margin =
                                        "0";


                                    headerImage.style.padding =
                                        "0";


                                    headerImage.style.border =
                                        "0";


                                    headerImage.style.zIndex =
                                        "0";


                                    /*
                                    ---------------------------------
                                    MASUKKAN KE HEADER
                                    ---------------------------------
                                    */

                                    clonedHeader.insertBefore(
                                        headerImage,
                                        clonedHeader.firstChild
                                    );


                                    /*
                                    ---------------------------------
                                    SEMBUNYIKAN SETTINGS DI CLONE
                                    ---------------------------------
                                    */

                                    const clonedSettings =
                                        clonedPage.querySelector(
                                            ".settings-area"
                                        );


              if (
                                        clonedSettings
                                    ) {

                                        clonedSettings.style.display =
                                            "none";

                                    }

                                }

                        }
                    );


                /*
                =====================================
                KEMBALIKAN TOMBOL DI HALAMAN ASLI
                =====================================
                */

                if (settingsArea) {

                    settingsArea.style.display =
                        "";

                }


                /*
                =====================================
                DOWNLOAD PNG
                =====================================
                */

                const link =
                    document.createElement(
                        "a"
                    );


                link.download =
                    "daftar-database-jackpot.png";


                link.href =
                    canvas.toDataURL(
                        "image/png"
                    );


                document.body.appendChild(
                    link
                );


                link.click();


                link.remove();


                /*
                =====================================
                KEMBALIKAN BUTTON
                =====================================
                */

                downloadTableBtn.innerHTML =
                    originalText;


                downloadTableBtn.disabled =
                    false;


                /*
                =====================================
                ALERT BERHASIL
                =====================================
                */

                showDownloadSuccess();


            } catch (error) {

                console.error(
                    "DOWNLOAD ERROR:",
                    error
                );


                /*
                =====================================
                KEMBALIKAN SETTINGS
                =====================================
                */

                if (settingsArea) {

                    settingsArea.style.display =
                        "";

                }


                /*
                =====================================
                KEMBALIKAN BUTTON
                =====================================
                */

                downloadTableBtn.innerHTML =
                    originalText;


                downloadTableBtn.disabled =
                    false;


                alert(
                    "Gagal membuat gambar. Cek Console untuk detail error."
                );

            }

        }
    );


    /* ==========================================
       ALERT BERHASIL SIMPAN
    ========================================== */

    function showSuccessAlert() {

        const oldAlert =
            document.querySelector(
                ".professional-alert"
            );


        if (oldAlert) {
            oldAlert.remove();
        }


        const overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "professional-alert";


        overlay.innerHTML = `

            <div class="professional-alert-box">

                <div class="professional-check">
                    ✓
                </div>

                <div class="professional-alert-title">
                    Berhasil!
                </div>

                <div class="professional-alert-text">
                    Data berhasil diperbarui
                    dan disimpan.
                </div>

                <button
                    type="button"
                    class="professional-alert-button"
                    id="alertOkButton"
                >
                    OK
                </button>

                <div class="professional-alert-copyright">
                    © TEAM TARSIUS
                </div>

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        requestAnimationFrame(
            function () {

                overlay.classList.add(
                    "show"
                );

            }
        );


        const okButton =
            overlay.querySelector(
                "#alertOkButton"
            );


        if (okButton) {

            okButton.addEventListener(
                "click",
                function () {

                    closeProfessionalAlert(
                        overlay
                    );

                }
            );

        }


        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    overlay
                ) {

                    closeProfessionalAlert(
                        overlay
                    );

                }

            }
        );

    }


    /* ==========================================
       ALERT BERHASIL DOWNLOAD
    ========================================== */

    function showDownloadSuccess() {

        const oldAlert =
            document.querySelector(
                ".professional-alert"
            );


        if (oldAlert) {
            oldAlert.remove();
        }


        const overlay =
            document.createElement(
                "div"
            );


        overlay.className =
            "professional-alert";


        overlay.innerHTML = `

            <div class="professional-alert-box">

                <div class="professional-check">
                    ✓
                </div>

                <div class="professional-alert-title">
                    Berhasil!
                </div>

                <div class="professional-alert-text">
                    Header dan tabel berhasil dibuat
                    dan siap disimpan.
                </div>

                <button
                    type="button"
                    class="professional-alert-button"
                    id="downloadAlertOk"
                >
                    OK
                </button>

                <div class="professional-alert-copyright">
                    © TEAM TARSIUS
                </div>

            </div>

        `;


        document.body.appendChild(
            overlay
        );


        requestAnimationFrame(
            function () {

                overlay.classList.add(
                    "show"
                );

            }
        );


        const okButton =
            overlay.querySelector(
                "#downloadAlertOk"
            );


        if (okButton) {

            okButton.addEventListener(
                "click",
                function () {

                    closeProfessionalAlert(
                        overlay
                    );

                }
            );

        }


        overlay.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    overlay
                ) {

                    closeProfessionalAlert(
                        overlay
                    );

                }

            }
        );

    }


    /* ==========================================
       TUTUP ALERT
    ========================================== */
    
    function closeProfessionalAlert(
        overlay
    ) {

        if (!overlay) {
            return;
        }


        overlay.classList.remove(
            "show"
        );


        setTimeout(
            function () {

                if (
                    overlay.parentNode
                ) {

                    overlay.remove();

                }

            },
            250
        );

    }


    /* ==========================================
       LOAD DATA LOCAL STORAGE
    ========================================== */

    function loadSavedData() {

        let changed =
            false;


        Object.keys(
            savedData
        ).forEach(
            function (key) {

                const index =
                    Number(key);


                const data =
                    savedData[key];


                const row =
                    rows[index];


                if (
                    !row ||
                    !data
                ) {

                    return;

                }


                const numberCell =
                    row.querySelector(
                        ".number-data"
                    );


                const jackpotCell =
                    row.querySelector(
                        ".jackpot-data"
                    );


                if (
                    !numberCell ||
                    !jackpotCell
                ) {

                    return;

                }


                /* ==============================
                   NOMOR
                ============================== */

                if (
                    typeof data.number ===
                    "string"
                ) {

                    const fixedNumber =
                        formatPhoneNumber(
                            data.number
                        );


                    numberCell.textContent =
                        fixedNumber;


                    if (
                        data.number !==
                        fixedNumber
                    ) {

                        savedData[index].number =
                            fixedNumber;


                        changed =
                            true;

                    }

                }


                /* ==============================
                   JACKPOT
                ============================== */

                if (
                    typeof data.jackpot ===
                    "string"
                ) {

                    jackpotCell.textContent =
                        data.jackpot;

                }

            }
        );


        /* ==============================
           SIMPAN PERBAIKAN
        ============================== */

        if (changed) {

            localStorage.setItem(
                "jackpotData",
                JSON.stringify(
                    savedData
                )
            );

        }

    }


    /* ==========================================
       JALANKAN DATA TERSIMPAN
    ========================================== */

    loadSavedData();

});