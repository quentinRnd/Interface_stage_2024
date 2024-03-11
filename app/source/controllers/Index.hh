#pragma once

#include <map>

#include <drogon/HttpSimpleController.h>
#include <drogon/HttpResponse.h>

#include "../config.hh"

// Only controller that serve a single view
class Index:
	public drogon::HttpSimpleController<Index>
{
	public:

		PATH_LIST_BEGIN
			PATH_ADD(config::url::root_url, drogon::Get, drogon::Post);
		PATH_LIST_END

		void asyncHandleHttpRequest(const drogon::HttpRequestPtr & req, std::function<void(const drogon::HttpResponsePtr &)> && callback) override;
};