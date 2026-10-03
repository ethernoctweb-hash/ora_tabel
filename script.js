document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ==========================================
           ELEMENT
        ========================================== */

        const settingsBtn =
            document.getElementById(
                "settingsBtn"
            );


        const downloadTableBtn =
            document.getElementById(
                "downloadTableBtn"
            );


        const editPanel =
            document.getElementById(
                "editPanel"
            );


        const closeBtn =
            document.getElementById(
                "closeBtn"
            );


        const rowSelect =
            document.getElementById(
                "rowSelect"
            );


        const numberInput =
            document.getElementById(
                "numberInput"
            );


        const jackpotInput =
            document.getElementById(
                "jackpotInput"
            );


        const saveBtn =
            document.getElementById(
                "saveBtn"
            );


        const rows =
            document.querySelectorAll(
                "#jackpotBody tr"
            );


        /* ==========================================
           LOCAL STORAGE
        ========================================== */

        let savedData = {};


        try {

            savedData =
                JSON.parse(
                    localStorage.getItem(
                        "jackpotData"
                    )
                ) || {};

        } catch (error) {

            savedData = {};

        }


        /* ==========================================
           FORMAT JACKPOT

           1100630
           ↓
           1.100.630.00
        ========================================== */

        function formatJackpot(value) {

            let numbers =
                String(value)
                    .replace(/\D/g, "");


            if (!numbers) {

                return "";

            }


            return (
                Number(numbers)
                    .toLocaleString("id-ID")
                +
                ".00"
            );

        }


        /* ==========================================
           FORMAT NOMOR

           85342231719
           ↓
           853-4223-1719

           085342231719
           ↓
           853-4223-1719

           6285342231719
           ↓
           853-4223-1719
        ========================================== */

        function formatPhoneNumber(value) {

            let number =
                String(value)
                    .replace(/\D/g, "");


            /*
             * Jika format 62 + nomor Indonesia
             */

            if (
                number.startsWith("62") &&
                number.length >= 3
            ) {

                number =
                    number.substring(2);

            }


            /*
             * Jika format 08...
             */

            if (
                number.startsWith("0")
            ) {

                number =
                    number.substring(1);

            }


            /*
             * Maksimal 11 digit
             */

            number =
                number.substring(0, 11);


            /*
             * 853
             */

            if (
                number.length <= 3
            ) {

                return number;

            }


            /*
             * 853-4223
             */

            if (
                number.length <= 7
            ) {

                return (
                    number.substring(0, 3)
                    +
                    "-"
                    +
                    number.substring(3)
                );

            }


            /*
             * 853-4223-1719
             */

            return (
                number.substring(0, 3)
                +
                "-"
                +
                number.substring(3, 7)
                +
                "-"
                +
                number.substring(7)
            );

        }


        /* ==========================================
           BUKA PANEL
        ========================================== */

        settingsBtn.addEventListener(
            "click",
            function () {

                loadSelectedData();

                editPanel.classList.add(
                    "show"
                );


                setTimeout(
                    function () {

                        numberInput.focus();


                        const length =
                            numberInput.value.length;


                        numberInput.setSelectionRange(
                            length,
                            length
                        );

                    },
                    100
                );

            }
        );


        /* ==========================================
           TUTUP PANEL
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
           LOAD DATA
        ========================================== */

        function loadSelectedData() {

            const index =
                Number(
                    rowSelect.value
                );


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


            /*
             * NUMBER
             */

            numberInput.value =
                numberCell.textContent.trim();


            /*
             * JACKPOT
             */

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
           
           AUTO FORMAT
           CURSOR TETAP
        ========================================== */

        numberInput.addEventListener(
            "input",
            function () {

                const oldValue =
                    this.value;


                const cursorBefore =
                    this.selectionStart;


                const digitsBeforeCursor =
                    oldValue
                        .slice(
                            0,
                            cursorBefore
                        )
                        .replace(
                            /\D/g,
                            ""
                        )
                        .length;


                const formatted =
                    formatPhoneNumber(
                        oldValue
                    );


                this.value =
                    formatted;


                const totalDigits =
                    formatted
                        .replace(
                            /\D/g,
                            ""
                        )
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

                } catch (error) {

                    // Abaikan error

                }

            }
        );


        /* ==========================================
           JACKPOT INPUT
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
           SIMPAN DATA
        ========================================== */

        saveBtn.addEventListener(
            "click",
            function () {

                const index =
                    Number(
                        rowSelect.value
                    );


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


                /* ==========================
                   NOMOR
                ========================== */

                let newNumber =
                    numberInput.value;


                newNumber =
                    formatPhoneNumber(
                        newNumber
                    );


                /*
                 * Update input
                 */

                numberInput.value =
                    newNumber;


                /*
                 * Update tabel
                 */

                numberCell.textContent =
                    newNumber;


                /* ==========================
                   JACKPOT
                ========================== */

                const rawJackpot =
                    jackpotInput.value
                        .replace(
                            /\D/g,
                            ""
                        );


                let finalJackpot;


                if (rawJackpot) {

                    finalJackpot =
                        formatJackpot(
                            rawJackpot
                        );

                } else {

                    finalJackpot =
                        "//";

                }


                /*
                 * Update tabel
                 */

                jackpotCell.textContent =
                    finalJackpot;


                /* ==========================
                   LOCAL STORAGE
                ========================== */

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


                /* ==========================
                   TUTUP PANEL
                ========================== */

                editPanel.classList.remove(
                    "show"
                );


                /* ==========================
                   POPUP
                ========================== */

                showSuccessAlert();

            }
        );


        /* ==========================================
           DOWNLOAD GAMBAR TABEL
        ========================================== */

        downloadTableBtn.addEventListener(
            "click",
            function () {

                const table =
                    document.querySelector(
                        ".jackpot-table"
                    );


                if (!table) {

                    return;

                }


                /*
                 * Cek library
                 */

                if (
                    typeof html2canvas ===
                    "undefined"
                ) {

                    alert(
                        "Library gambar belum siap. Coba lagi."
                    );

                    return;

                }


                /*
                 * Simpan teks tombol
                 */

                const originalText =
                    this.innerHTML;


                /*
                 * Ubah tombol
                 */

                this.innerHTML =
                    "⏳ <span>MEMBUAT GAMBAR...</span>";


                this.disabled = true;


                /*
                 * Buat PNG
                 */

                html2canvas(
                    table,
                    {

                        backgroundColor:
                            "#ffffff",

                        scale: 2,

                        useCORS: true,

                        logging: false

                    }
                )
                .then(
                    function (canvas) {


                        /*
                         * Buat link
                         */

                        const link =
                            document.createElement(
                                "a"
                            );


                        /*
                         * Nama file
                         */

                        link.download =
                            "daftar-database-jackpot.png";


                        /*
                         * Data gambar
                         */

                        link.href =
                            canvas.toDataURL(
                                "image/png"
                            );


                        /*
                         * Download
                         */

                        document.body.appendChild(
                            link
                        );


                        link.click();


                        link.remove();


                        /*
                         * Kembalikan tombol
                         */

                        downloadTableBtn.innerHTML =
                            originalText;


                        downloadTableBtn.disabled =
                            false;


                        /*
                         * Popup
                         */

                        showDownloadSuccess();

                    }
                )
                .catch(
                    function (error) {

                        console.error(
                            error
                        );


                        downloadTableBtn.innerHTML =
                            originalText;


                        downloadTableBtn.disabled =
                            false;


                        alert(
                            "Gagal membuat gambar tabel."
                        );

                    }
                );

            }
        );


        /* ==========================================
           SUCCESS ALERT SIMPAN
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
                        dan telah disimpan.
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
                document.getElementById(
                    "alertOkButton"
                );


            okButton.addEventListener(
                "click",
                function () {

                    closeProfessionalAlert(
                        overlay
                    );

                }
            );


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
           SUCCESS ALERT DOWNLOAD
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
                        Gambar tabel berhasil dibuat
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
                document.getElementById(
                    "downloadAlertOk"
                );


            okButton.addEventListener(
                "click",
                function () {

                    closeProfessionalAlert(
                        overlay
                    );

                }
            );


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
           CLOSE ALERT
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
           LOAD LOCAL STORAGE
           
           SEKALIGUS PERBAIKI NOMOR LAMA
        ========================================== */

        function loadSavedData() {

            let changed = false;


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


                    /* ==========================
                       NOMOR
                    ========================== */

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


                            changed = true;

                        }

                    }


                    /* ==========================
                       JACKPOT
                    ========================== */

                    if (
                        typeof data.jackpot ===
                        "string"
                    ) {

                        jackpotCell.textContent =
                            data.jackpot;

                    }

                }
            );


            /*
             * Simpan perbaikan
             */

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
           JALANKAN
        ========================================== */

        loadSavedData();

    }
);