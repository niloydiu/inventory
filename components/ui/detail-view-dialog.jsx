import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

/**
 * Reusable Detail View Dialog Component for displaying entity details
 * @param {Object} props
 * @param {boolean} props.open - Dialog open state
 * @param {Function} props.onOpenChange - Function to handle dialog state change
 * @param {string} props.title - Dialog title
 * @param {string} props.description - Dialog description
 * @param {Array} props.fields - Array of field objects {label, value, span, type, className}
 * @param {Object} props.data - Object with key-value pairs to display (alternative to fields)
 * @param {Function} props.onEdit - Optional edit handler
 * @param {React.ReactNode} props.children - Optional custom content
 */
export function DetailViewDialog({
  open,
  onOpenChange,
  title,
  description,
  fields = [],
  data,
  onEdit,
  children,
  maxWidth = "max-w-3xl",
}) {
  // Convert data object to fields array if data is provided
  const actualFields = data
    ? Object.entries(data).map(([key, value]) => ({
        label: key,
        value: typeof value === "object" && value !== null ? value.value : value,
        type: typeof value === "object" && value !== null ? value.type : undefined,
        span: typeof value === "object" && value !== null ? value.span : undefined,
        className: typeof value === "object" && value !== null ? value.className : undefined,
      }))
    : fields;
  const formatValue = (field) => {
    if (
      field.value === null ||
      field.value === undefined ||
      field.value === ""
    ) {
      return <span className="text-muted-foreground">N/A</span>;
    }

    switch (field.type) {
      case "currency":
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: field.currency || "USD",
        }).format(field.value);

      case "number":
        return new Intl.NumberFormat("en-US").format(field.value);

      case "date":
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(field.value));

      case "datetime":
        return new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(field.value));

      case "badge":
        return (
          <Badge className={field.badgeClass} variant="outline">
            {field.value}
          </Badge>
        );

      case "email":
        return (
          <a
            href={`mailto:${field.value}`}
            className="text-blue-600 hover:underline"
          >
            {field.value}
          </a>
        );

      case "phone":
        return (
          <a
            href={`tel:${field.value}`}
            className="text-blue-600 hover:underline"
          >
            {field.value}
          </a>
        );

      case "url":
        return (
          <a
            href={field.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {field.value}
          </a>
        );

      case "boolean":
        return field.value ? "Yes" : "No";

      case "list":
        return (
          <ul className="list-disc list-inside">
            {field.value.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );

      default:
        return field.value;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={maxWidth}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">
          {children || (
            <div className="grid grid-cols-2 gap-4">
              {actualFields.map((field, idx) => (
                <div
                  key={idx}
                  className={`${field.span === 2 ? "col-span-2" : ""} ${
                    field.className || ""
                  }`}
                >
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                    {field.label}
                  </Label>
                  <div
                    className={`mt-1 ${
                      field.large ? "text-lg font-medium" : ""
                    } ${field.mono ? "font-mono" : ""}`}
                  >
                    {formatValue(field)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          {onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
