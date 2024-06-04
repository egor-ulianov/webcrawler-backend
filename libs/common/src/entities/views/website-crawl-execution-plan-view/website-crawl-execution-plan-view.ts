import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
  SELECT 
    "wr"."id" as "siteId",
    "wr"."label" AS "label",
    "wr"."isActive" as "isActive",
    "wr"."periodicity" as "periodicity", 
    "wcep"."date" + "wr"."periodicity" * interval '1 second' as "nextExecutionDate",
    "wr"."url" as "url",
    array_agg("t"."name") as "tags", 
    "wcep"."date" as "date", 
    "wcep"."state" as "state"
  FROM "WebsiteRecord" "wr"
    LEFT JOIN "WebsiteCrawlExecutionPlan" "wcep" ON "wcep"."websiteRecordId" = "wr"."id" 
    LEFT JOIN "WebsiteRecordTag" "wrt" ON "wr"."id" = "wrt"."websiteRecordId" 
    LEFT JOIN "Tag" "t" ON "wrt"."tagId" = "t"."id"
  WHERE "wcep"."date" IS NULL OR "wcep"."date" = (
    SELECT MAX("wcep2"."date") 
    FROM "WebsiteCrawlExecutionPlan" "wcep2" 
    WHERE "wcep2"."websiteRecordId" = "wr"."id" AND "wcep2"."state" IN ('Completed', 'Failed')
  )
  GROUP BY "wr"."id", "wr"."isActive", "wr"."label", "wr"."periodicity", "wr"."url", "wcep"."date", "wcep"."state";
  `,
})
export class WebsiteCrawlExecutionPlanView {

  @ViewColumn()
  public siteId: number;

  @ViewColumn()
  public isActive: boolean;

  @ViewColumn()
  public label: string;

  @ViewColumn()
  public url: string;

  @ViewColumn()
  public periodicity: number;

  @ViewColumn()
  public nextExecutionDate: Date;

  @ViewColumn()
  public tags: string[];

  @ViewColumn()
  public date: Date;

  @ViewColumn()
  public state: string;
}
