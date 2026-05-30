// Verity — Component index. Loads after every other JSX file
// and exports each component to window so other Babel scripts can import.
Object.assign(window, {
  // Logo
  VerityMark, VerityWordmark, VerityLogo,
  // Button
  Button,
  // Badge / Tag
  Badge, Tag,
  // Alert
  Alert,
  // Banner
  Banner,
  // Overlays
  Modal, Toast, ToastRegion,
  // Card
  Card,
  // Table
  Table,
  // Domain primitives
  ConfidenceBand, BandDisplay, Vpid, Vpr,
  // Avatar
  Avatar, AvatarStack,
  // Form
  FormField, Input, Textarea, Select, Checkbox, Radio,
  // Toggle / Segmented
  Toggle, Segmented,
  // Nav
  Tabs, Breadcrumbs, Pagination,
  // Progress
  Progress,
});

// Convenience: tone + brand constants for runtime use
window.VERITY_TOKENS = {
  navy:'#1E2260', navyDeep:'#171A4A',
  cream:'#F5F2ED', creamShade:'#EEEAE0',
  gold:'#C9A961', goldDeep:'#A88A45',
  slate:'#6B6F77',
  success:'#3A7A5C', warning:'#B8862A', danger:'#A8302A', info:'#3C5A9C',
};
