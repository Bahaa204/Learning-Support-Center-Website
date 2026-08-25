import { DatabaseIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import type {
  SettingsExportFormat,
  SettingsPageSize,
  UpdateSettingsFunction,
} from "@/types/settings";

type DataAndRecordsSectionProps = {
  PageSize: SettingsPageSize;
  ExportFormat: SettingsExportFormat;
  ArchiveRetention: number;
  UpdateSetting: UpdateSettingsFunction;
};

export default function DataAndRecordsSection({
  PageSize,
  ExportFormat,
  ArchiveRetention,
  UpdateSetting,
}: DataAndRecordsSectionProps) {
  return (
    <Card className='settings-section' id='data-records'>
      <CardHeader className='settings-section-title flex flex-wrap items-center gap-4 pl-0'>
        <DatabaseIcon size={30} />
        <div className='flex flex-col'>
          <CardTitle className='font-extrabold text-[1.25rem]'>
            Data & Records
          </CardTitle>
          <CardDescription>
            Configure how data is displayed, exported, and retained in the
            application. Changes will be saved automatically.
          </CardDescription>
        </div>
      </CardHeader>

      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='pageSize'>Default Page Size</FieldLabel>
            <Select
              value={String(PageSize)}
              onValueChange={(value) =>
                UpdateSetting("pageSize", Number(value) as SettingsPageSize)
              }
            >
              <SelectTrigger id='pageSize'>
                <SelectValue placeholder='Select page size' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='5'>5 records per page</SelectItem>
                <SelectItem value='10'>10 records per page</SelectItem>
                <SelectItem value='25'>25 records per page</SelectItem>
                <SelectItem value='50'>50 records per page</SelectItem>
                <SelectItem value='100'>100 records per page</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Number of records shown per page in tables.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Export Format</FieldLabel>
            <RadioGroup
              value={ExportFormat}
              onValueChange={(value) =>
                UpdateSetting("exportFormat", value as SettingsExportFormat)
              }
            >
              <div className='flex items-center gap-3'>
                <RadioGroupItem
                  value='csv'
                  id='csv-export'
                  className={`${ExportFormat === "csv" ? "btn-primary" : ""}`}
                />
                <Label htmlFor='csv-export' className='cursor-pointer'>
                  CSV
                </Label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem
                  value='excel'
                  id='excel-export'
                  className={`${ExportFormat === "excel" ? "btn-primary" : ""}`}
                />
                <Label htmlFor='excel-export' className='cursor-pointer'>
                  Excel
                </Label>
              </div>
            </RadioGroup>
            <FieldDescription>
              Default format for exporting records.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor='archiveRetention'>
              Archive Retention
            </FieldLabel>
            <Input
              id='archiveRetention'
              type='number'
              min='30'
              max='730'
              step='30'
              value={String(ArchiveRetention)}
              onChange={(e) =>
                UpdateSetting("archiveRetention", Number(e.target.value))
              }
            />
            <FieldDescription>
              Days to keep archived records before deletion (
              {ArchiveRetention} days).
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </Card>
  );
}
