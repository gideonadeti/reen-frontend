interface ElementProps {
  children: React.ReactNode;
  className?: string;
}

const H1 = ({ children, className = "" }: ElementProps) => (
  <h1 className={`text-4xl font-bold my-4 ${className}`}>{children}</h1>
);

const H2 = ({ children, className = "" }: ElementProps) => (
  <h2 className={`text-3xl font-bold my-3 ${className}`}>{children}</h2>
);

const H3 = ({ children, className = "" }: ElementProps) => (
  <h3 className={`text-2xl font-bold my-3 ${className}`}>{children}</h3>
);

const H4 = ({ children, className = "" }: ElementProps) => (
  <h4 className={`text-xl font-bold my-2 ${className}`}>{children}</h4>
);

const H5 = ({ children, className = "" }: ElementProps) => (
  <h5 className={`text-lg font-bold my-2 ${className}`}>{children}</h5>
);

const H6 = ({ children, className = "" }: ElementProps) => (
  <h6 className={`text-base font-bold my-2 ${className}`}>{children}</h6>
);

const Muted = ({ children, className = "" }: ElementProps) => (
  <p className={`text-muted-foreground ${className}`}>{children}</p>
);

export { H1, H2, H3, H4, H5, H6, Muted };
