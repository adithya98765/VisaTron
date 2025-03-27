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
    return await response.json();
  } catch (error) {
    console.error("Error fetching visa info:", error);
    return { error: "Failed to fetch visa information" };
  }
}

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Popup Content</h3>
        <p>This is a centered modal.</p>
        <button onClick={onClose}>Close</button>
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
        setCountryData({
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
        });
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
      <h3 className="country-title">{country?.toUpperCase()}</h3>
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

      <h3 className="visa-title">VISA REQUIREMENTS</h3>
      <div className="visa-container">
        <p>INDIA to {country?.toUpperCase()}</p>
        <div className="visa-details">
          <p style={{ fontWeight: 900, fontSize: 20 }}>
            {visaData && visaData.category && visaData.category.name !== "loading...."
              ? visaData.category.name + (isSchengenCountry(country) ? " (Schengen)" : "")
              : "Loading..."}
          </p>
          {visaData?.last_updated && (
            <p style={{ fontSize: "0.9rem", color: "gray" }}>
              Last Updated: {new Date(visaData.last_updated).toLocaleString()}
            </p>
          )}
          <p
            onClick={() => setIsOpen(true)}
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            Click Here
          </p>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="container">
        <img src={panam} className="panamstyl" alt="PanAm Logo" />
      </div>
    </>
  );
}

export default FlyPage;
