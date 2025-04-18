+++
date = "2017-05-26T13:27:00+07:00"
title = "Working with DB datetime/date columns in Go"
tags = [ "golang", "databases", "sql" ]
type = "post"
og_image = "/godefault.png"
description = "How to work with DATETIME/DATE columns and use Go standard time.Time avoiding manual string parsing."
+++

This post shows how to work with `DATETIME`` / `DATE` database columns and use Go standard `time.Time` avoiding manual string parsing. This article contains examples using 2 packages: `database/sql` and `github.com/go-sql-driver/mysql`.

### Retrieve nullable time field using NullTime type

MySQL, PostgreSQL drivers in Go provide this nullable type which represents a `time.Time` that may be NULL. `NullTime` implements the Scanner interface so it can be used as a scan destination:

```go
var nt mysql.NullTime
err := db.QueryRow("SELECT time FROM foo WHERE id = ?", id).Scan(&nt)

if nt.Valid {
   // use nt.Time
} else {
   // NULL value if Valid is false
}
```

### Use parseTime=true

You can ask the driver to scan `DATE` and `DATETIME` automatically to `time.Time`, by adding [parseTime=true](https://github.com/go-sql-driver/mysql#timetime-support) to your connection string (DSN).

```go
db, err := sql.Open("mysql", "root:@/?parseTime=true")

var myTime time.Time

db.QueryRow("SELECT current_timestamp()").Scan(&myTime)

fmt.Println(myTime.Format(time.RFC3339))
```

### Limitation: TIME column type

Note that `parseTime=tru`e does not automatically convert the MySQL `TIME` column type to `time.Time`. The `TIM`E type represents a time of day or duration, not a full timestamp. You should scan `TIME` columns into `[]byte` or string and handle the parsing manually if needed.

