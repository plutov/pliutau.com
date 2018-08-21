+++
date = "2017-05-26T13:27:00+07:00"
title = "Working with DB datetime/date columns in Go"
tags = [ "go", "db", "golang", "mysql" ]
type = "post"
+++

This post shows how to work with DATETIME/DATE columns in DB and use Go standard `time.Time` avoiding manual string parsing. This article contains examples using 2 packages: `database/sql` and `github.com/go-sql-driver/mysql`.

### Retrieve nullable time field using NullTime type

MySQL, PostgreSQL drivers in Go provide this nullable type which represents a `time.Time` that may be NULL. `NullTime` implements the Scanner interface so it can be used as a scan destination:

{{< gist plutov 7755871af7ac99b095e887ad55e0b28c >}}

### Use parseTime=true

Assuming you're using the `go-sql-driver/mysql`  you can ask the driver to scan `DATE` and `DATETIME` automatically to `time.Time`, by adding [parseTime=true](https://github.com/go-sql-driver/mysql#timetime-support) to your connection string.

{{< gist plutov 1c1370a2053bef979628d89bdf5e138c >}}

### It doesn't work with TIME column type

Notice that this doesn't work with `current_time`. If you must use `current_time` you'll need to do the parsing by yourself.
