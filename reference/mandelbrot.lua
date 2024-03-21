local json = require("json")

LATEST_MANDELBROT = LATEST_MANDELBROT or ""

-- Function to calculate the Mandelbrot set
-- @param maxIterationsPerPoint (number) - The maximum number of iterations to perform for each point in the Mandelbrot set calculation
-- @param width (number) - The width of the output image or canvas
-- @param height (number) - The height of the output image or canvas
function calculateMandelbrotSet(maxIterationsPerPoint, width, height)
    local REAL_SET = { start = -2, endRange = 1 }
    local IMAGINARY_SET = { start = -1, endRange = 1 }

    local output = {}

    for y = 0, height - 1 do
        for x = 0, width - 1 do
            local c_re = REAL_SET.start + (x / width) * (REAL_SET.endRange - REAL_SET.start)
            local c_im = IMAGINARY_SET.start + (y / height) * (IMAGINARY_SET.endRange - IMAGINARY_SET.start)

            local z_re = 0
            local z_im = 0
            local m = 0
            local isMandelbrotSet = true

            while m < maxIterationsPerPoint do
                local z_re_sq = z_re * z_re
                local z_im_sq = z_im * z_im

                if z_re_sq + z_im_sq > 4 then
                    isMandelbrotSet = false
                    break
                end

                z_im = 2 * z_re * z_im + c_im
                z_re = z_re_sq - z_im_sq + c_re

                m = m + 1
            end

            table.insert(output, { x = x, y = y, m = m, isMandelbrotSet = isMandelbrotSet })
        end
    end

    return output
end

-- Handler to calculate the Mandelbrot set
Handlers.add(
    "CalculateMandelbrotSet",
    Handlers.utils.hasMatchingTag("Action", "CalculateMandelbrotSet"),
    function(Msg)
        local maxIterationsPerPoint = tonumber(Msg.Tags.MaxIterationsPerPoint)
        local width = tonumber(Msg.Tags.Width)
        local height = tonumber(Msg.Tags.Height)

        if maxIterationsPerPoint and width and height then
            local output = calculateMandelbrotSet(maxIterationsPerPoint, width, height)
            local outputJSON = json.encode(output)
            LATEST_MANDELBROT = outputJSON -- Store the latest calculation
            ao.send({
                Target = Msg.From,
                Action = "MandelbrotSetResult",
                Data = outputJSON
            })
        else
            ao.send({
                Target = Msg.From,
                Action = "Error",
                Message = "Invalid parameters provided"
            })
        end
    end
)

-- Handler to retrieve the latest Mandelbrot set calculation
Handlers.add(
    "GetLatestMandelbrotSet",
    Handlers.utils.hasMatchingTag("Action", "GetLatestMandelbrotSet"),
    function(Msg)
        ao.send({
            Target = Msg.From,
            Action = "LatestMandelbrotSetResult",
            Data = LATEST_MANDELBROT
        })
    end
)

