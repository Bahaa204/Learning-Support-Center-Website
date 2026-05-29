import { InfoIcon } from "lucide-react";
import { useState } from "react";
import FooterModal from "./FooterModal";

export default function Footer() {
  const [Open, setOpen] = useState<boolean>(false);

  return (
    <>
      <footer className='site-footer'>
        &copy; 2026 &nbsp;<span>RHU Learning Support Center</span>&nbsp; —
        College of Arts &amp; Sciences &nbsp;|&nbsp; All rights reserved.
        <span className='footer-info-wrap' aria-label='Credits'>
          <span className='footer-info-icon' aria-hidden='true'>
            <InfoIcon onClick={() => setOpen(true)} />
          </span>
        </span>
      </footer>

      <FooterModal IsOpen={Open} setIsOpen={setOpen} />
    </>
  );
}
