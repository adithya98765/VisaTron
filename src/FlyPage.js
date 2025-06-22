import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import panam from "./img/panam-tag.png";
import "./FlyPageStyl.css";

const SCHENGEN_COUNTRIES = new Set([
  "Austria", "Belgium", "Czechia", "Denmark", "Estonia", "Finland", "France",
  "Germany", "Greece", "Hungary", "Iceland", "Italy", "Latvia", "Liechtenstein",
  "Lithuania", "Luxembourg", "Malta", "Netherlands", "Norway", "Poland",
  "Portugal", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland"
]);

const isSchengenCountry = (countryName) => SCHENGEN_COUNTRIES.has(countryName);

async function fetchCountryData(countryName) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const countries = await response.json();
    return countries[0] || null;
  } catch (error) {
    console.error("Error fetching country data:", error);
    return null;
  }
}

async function fetchVisaInfo(isoCode) {
  if (!isoCode) return { error: "Invalid destination country" };
  try {
    const response = await fetch(`https://rough-sun-2523.fly.dev/visa/IN/${isoCode}`);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response not ok: ${response.status} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Visa Info Fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching visa info:", error);
    return { error: error.message };
  }
}


const Modal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      // Restore scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      // Cleanup if modal unmounts
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontWeight: 800, letterSpacing: -1 }}>TYPES OF VISA</h2>
        
        
        <div className="accordion-item">
          <div className="accordion-header" onClick={(e) => e.currentTarget.parentElement.classList.toggle('open')}>
            <span className="arrow">&gt;</span> Visa Free
          </div>
          <div className="accordion-content">
            <p>Visa-free travel implies that you do not need a visa at all to enter the country for short stays like tourism or business. If your passport is eligible, you can go straight to the airport and board your flight without filling out any visa forms or paying any fees. When you arrive, you just show your passport at immigration, and you’re allowed in—usually for a limited time like 30, 60, or 90 days. It’s the easiest way to travel, but make sure your passport is valid and you meet any other entry rules like proof of return ticket or accommodation. Always double-check the latest entry requirements before you book your trip, as rules can sometimes change.</p>
          </div>
        </div>

    
        <div className="accordion-item">
          <div className="accordion-header" onClick={(e) => e.currentTarget.parentElement.classList.toggle('open')}>
            <span className="arrow">&gt;</span> eVisa
          </div>
          <div className="accordion-content">
            <p>An eVisa is a type of visa that you can apply for completely online. Instead of going to an embassy or consulate, you visit the official website of the country you plan to visit. There, you fill out an application form, upload required documents (like a passport scan or a photo), and pay a visa fee. Once your application is processed and approved, you’ll usually receive an email confirmation or a downloadable PDF document. You print this out and carry it with you during your trip. At the border, immigration officers will verify the eVisa before letting you enter. EVisas are usually available for tourism, business, or short visits and are becoming more popular because they are faster and more convenient.</p>
          </div>
        </div>

        
        <div className="accordion-item">
          <div className="accordion-header" onClick={(e) => e.currentTarget.parentElement.classList.toggle('open')}>
            <span className="arrow">&gt;</span> Visa on Arrival
          </div>
          <div className="accordion-content">
            <p>Visa on Arrival would mean that you do not have to apply for a visa before your trip. Instead, when you land at the airport or reach a land border, you can apply for the visa right there by filling out a simple form and paying the visa fee at the immigration counter. You’ll need to bring your passport and may also need documents like a return flight ticket, hotel reservation, or proof of funds, depending on the country’s rules. Once your application is approved, the visa is stamped or attached to your passport, allowing you to enter and stay for a set period. This option is great for travelers who make last-minute plans or come from countries eligible for visa on arrival. However, always check ahead if you qualify, as not everyone can get a visa this way.</p>

          </div>
        </div>

        
        <div className="accordion-item">
          <div className="accordion-header" onClick={(e) => e.currentTarget.parentElement.classList.toggle('open')}>
            <span className="arrow">&gt;</span> eTA
          </div>
          <div className="accordion-content">
            <p>An eTA is an electronic permission you must obtain before flying to certain countries that require pre-screening of travelers. It is not a full visa but serves as a travel authorization linked electronically to your passport. To get an eTA, you complete a simple online application form and pay a small processing fee. Approval usually comes quickly—sometimes within minutes—allowing you to board your flight with confidence. The eTA helps the destination country screen travelers in advance to improve border security and streamline entry. It is important to remember that an eTA is only required if you are arriving by air; entry by land or sea typically does not need this authorization.</p>
          </div>
        </div>

        
        <div className="accordion-item">
          <div className="accordion-header" onClick={(e) => e.currentTarget.parentElement.classList.toggle('open')}>
            <span className="arrow">&gt;</span> Visa Required (Regular Visa)
          </div>
          <div className="accordion-content">
            <p>When a visa is required, it means you must get permission to enter a country before you travel. This often involves visiting an embassy, consulate, or visa application center. The process typically includes filling out a form, submitting several documents (like your passport, photos, flight and hotel bookings, proof of financial means), attending an interview, and paying a fee. It can take a few days to several weeks to get approved. Once you receive the visa, it’s either stamped in your passport or issued as a separate document. This is the most traditional form of visa and is common for longer stays or travel to countries with stricter entry rules.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
};




function FlyPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");
  const [countryData, setCountryData] = useState(null);
  const [visaData, setVisaData] = useState(null);

  useEffect(() => {
    if (!country) return;
    (async () => {
      const data = await fetchCountryData(country);
      if (data) {
        const extracted = {
          isoCode: data.cca2 || "",
          currencyDetails: data.currencies ? Object.entries(data.currencies).map(
            ([code, { name, symbol }]) => `${name} | ${code} | ${symbol || ""}`
          ) : [],
          capital: data.capital?.join(", ") || "No capital information available",
          timeZone: data.timezones?.join(", ") || "No TimeZone Found",
          flag: data.flags?.svg || "",
          drivingSide: data.car?.side ?? "Unknown",
          callingCode: data.idd?.root ? `${data.idd.root}${data.idd.suffixes?.join(", ") || ""}` : "No Data",
          mapUrl: `https://www.google.com/maps?q=${encodeURIComponent(country)}&t=k&output=embed`
        };
        setCountryData(extracted);
      }
    })();
  }, [country]);

  useEffect(() => {
    if (!countryData?.isoCode) return;
    (async () => {
      const visaInfo = await fetchVisaInfo(countryData.isoCode);
      setVisaData(visaInfo);
    })();
  }, [countryData]);

  return (
    <>
      <h4 className="country-title">{country?.toUpperCase()}</h4>
      <div className="custom-container">
        {countryData?.flag && <img src={countryData.flag} className="flagstyl" alt={`${country} Flag`} />}
        <p>You're visiting {country}</p>
        {countryData?.currencyDetails.length > 0 && <p>Currency: {countryData.currencyDetails.join(", ")}</p>}
        <p>Capital City: {countryData?.capital}</p>
        <p>Time Zone: {countryData?.timeZone}</p>
        <p>Driving Side: {countryData?.drivingSide}</p>
        <p>Calling Code: {countryData?.callingCode}</p>
      </div>

      {countryData?.mapUrl && (
        <iframe
          title="Google Maps"
          className="map-iframe"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={countryData.mapUrl}
        ></iframe>
      )}

      <h4 className="visa-title">VISA REQUIREMENTS</h4>
      <div className="visa-container">
        <p>INDIA to {country?.toUpperCase()}</p>
        <div className="visa-details" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <p style={{ fontWeight: 900, fontSize: 20, margin: 0 }}>
            {visaData?.category?.name
              ? visaData.category.name + (isSchengenCountry(country) ? " (Schengen)" : "")
              : visaData?.error
              ? "Error: " + visaData.error
              : "Loading..."}
          </p>
          <p
            onClick={() => setIsOpen(true)}
            style={{ cursor: "pointer", color: "blue", fontSize: 18, margin: 0 }}
            title="More info"
          >
            ⓘ
          </p>
        </div>
        {visaData?.last_updated && (
          <p style={{ fontSize: "0.9rem", color: "gray", marginTop: 5 }}>
            Last Updated: {new Date(visaData.last_updated).toLocaleString()}
          </p>
        )}
      </div>

      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <div className="container text-center mt-5">
        <img src={panam} className="panamstyl" alt="PanAm Logo" />
      </div>
    </>
  );
}

export default FlyPage;
