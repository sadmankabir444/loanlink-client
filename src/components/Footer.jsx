export default function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <aside>
        <p className="font-semibold text-lg">LoanLink © {new Date().getFullYear()}</p>
        <p>All Rights Reserved</p>
      </aside>
    </footer>
  );
}
